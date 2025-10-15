
import React, { useCallback } from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import AchievementBox from '@/components/Achievements/AchievementBox';
import AchievementHeader from '@/components/Achievements/AchievementHeader';
import AchievementStats from '@/components/Achievements/AchievementStats';
import AchievementFilterSection from '@/components/Achievements/AchievementFilterSection';
import { useRouter } from 'expo-router';
import useTheme from '@/hooks/useTheme';
import { useAchievementData } from '@/hooks/useAchievementData';
import { useAchievementFilters } from '@/hooks/useAchievementFilters';
import { getTierColor } from '@/utils/achievements';

export default function AchievementScreen() {
    const router = useRouter();
    const { primary, text, background } = useTheme();
    
    // Custom hooks for data and filters
    const { achievements, totalPoints, games, refreshing, onRefresh } = useAchievementData();
    const {
        filterType,
        setFilterType,
        selectedTier,
        setSelectedTier,
        selectedGame,
        setSelectedGame,
        selectedCategory,
        setSelectedCategory,
        resetFilters,
        filteredAchievements,
        activeFilterCount,
    } = useAchievementFilters(achievements);

    // Render item function for FlatList
    const renderAchievement = useCallback(({ item }: { item: any }) => {
        const iconName = item.icon || 'trophy';
        const iconColor = item.unlocked ? getTierColor(item.tier) : '#666';
        
        return (
            <AchievementBox
                icon={<FontAwesome5 name={iconName} size={36} color={iconColor} />}
                title={item.title}
                description={item.description}
                tier={item.tier}
                points={item.points}
                segment={item.progress || 0}
                total={item.criteria.threshold}
                unlocked={item.unlocked}
                gameTitle={item.gameTitle}
            />
        );
    }, []);

    // Key extractor for FlatList
    const keyExtractor = useCallback((item: any, index: number) => {
        return item.id?.toString() || `achievement-${index}`;
    }, []);

    // List header component
    const ListHeaderComponent = useCallback(() => (
        <>
            <AchievementStats
                totalPoints={totalPoints}
                unlockedCount={achievements.filter(a => a.unlocked).length}
                totalCount={achievements.length}
            />
            <AchievementFilterSection
                filterType={filterType}
                setFilterType={setFilterType}
                selectedTier={selectedTier}
                setSelectedTier={setSelectedTier}
                selectedGame={selectedGame}
                setSelectedGame={setSelectedGame}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                games={games}
                resetFilters={resetFilters}
                primary={primary}
                background={background}
                activeFilterCount={activeFilterCount}
            />
        </>
    ), [
        totalPoints, 
        achievements, 
        filterType, 
        selectedTier, 
        selectedGame, 
        selectedCategory, 
        games, 
        resetFilters, 
        primary, 
        background,
        activeFilterCount
    ]);

    const ListEmptyComponent = useCallback(() => (
        <View style={{ padding: 32, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, opacity: 0.6 }}>No achievements found</Text>
        </View>
    ), []);

    const ListFooterComponent = useCallback(() => (
        <View style={{ height: 100 }} />
    ), []);

    return (
        <View style={styles.container}>
            <AchievementHeader onBack={() => router.back()} textColor={text} />

            <FlatList
                data={filteredAchievements}
                renderItem={renderAchievement}
                keyExtractor={keyExtractor}
                ListHeaderComponent={ListHeaderComponent}
                ListEmptyComponent={ListEmptyComponent}
                ListFooterComponent={ListFooterComponent}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
                updateCellsBatchingPeriod={50}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={primary}
                        colors={[primary]}
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
