import React, { useState, useContext, useCallback } from "react";
import { Alert, StyleSheet } from "react-native";
import { ScrollView } from "@/components/Themed";
import GameSelector from "@/components/Home/GameSelector/GameSelector";
import SelectGame from "@/components/Modals/SelectGame";
import { useRouter } from "expo-router";
import { DBContext } from "@/contexts/DBContext";
import { GameTitle, Difficulty, Games } from "@/constants/Types";
import Difficulties from '@/constants/Difficulties';
import { FadeInView } from "@/components/animations";
import { useGameSessions } from "@/contexts/GameSessionContext";
import { getSessionGame, getSessionGameById } from "@/constants/GameSessionRoutes";
import { getDailyKey, readLegacyDailyCompletion } from "@/utils/DailyChallenge";
import { useSQLiteContext } from "expo-sqlite";
import { isDailyCompleted } from "@/db/Sessions/Sessions";

export default function HomeScreen() {

    const [showSelectGame, setShowSelectGame] = useState(false);
    const [selectedGame, setSelectedGame] = useState<Games | null>(null);
    const { handleCurGame } = useContext(DBContext);
    const { runs, unavailable, loading, error, refresh, discard } = useGameSessions();
    const db = useSQLiteContext();

    const router = useRouter();

    const handleSelectGame = (game: Games) => {
        setSelectedGame(game);
        setShowSelectGame(true);
        void refresh();
    };

    const handleCloseModal = () => {
        setShowSelectGame(false);
    };

    const confirmSelectGame = (title: string, difficulty: Difficulty, mode: string) => {
        const game = getSessionGame(title);
        if (game) {
            const dailyDate = mode === 'Daily Challenge' ? getDailyKey() : undefined;
            const saved = runs.find(run =>
                run.identity.gameId === game.id && run.identity.mode === mode &&
                (!dailyDate || (run.identity.dailyDate === dailyDate && run.identity.difficulty === difficulty))
            );
            const launch = () => {
                handleCloseModal();
                handleCurGame(title);
                router.push({
                    pathname: game.pathname,
                    params: { difficulty, mode, dailyDate, replaceSessionId: saved?.id },
                });
            };
            if (saved) {
                Alert.alert('Replace saved game?', 'Starting a new game will replace your unfinished run.', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Replace', style: 'destructive', onPress: launch },
                ]);
            } else {
                launch();
            }
            return;
        }
        handleCloseModal();
        handleCurGame(title);
        switch (title) {
            case "Ostrich Haul":
                return router.push(`/ostrichhaul?difficulty=${difficulty}&mode=${mode}`);
            case "GoGoBird":
                return router.push(`/gogobird?difficulty=${difficulty}&mode=${mode}`);
            case "DolphinDive":
                return router.push(`/dolphindive?difficulty=${difficulty}&mode=${mode}`);
            default:
                return "";
        }
    };

    const continueGame = (sessionId: string) => {
        const saved = runs.find(run => run.id === sessionId);
        const game = saved && getSessionGameById(saved.identity.gameId);
        if (!saved || !game) {
            Alert.alert('Saved game unavailable', 'Refresh saved games and try again.');
            void refresh();
            return;
        }
        handleCloseModal();
        handleCurGame(game.title);
        router.push({ pathname: game.pathname, params: { ...saved.identity, sessionId } });
    };

    const checkDailyCompleted = useCallback(async (title: string, difficulty: string) => {
        const game = getSessionGame(title);
        if (!game) throw new Error(`Unknown Daily game: ${title}`);
        const dailyDate = getDailyKey();
        return await isDailyCompleted(db, { gameId: game.id, mode: 'Daily Challenge', difficulty, dailyDate }) ||
            await readLegacyDailyCompletion(title, difficulty, dailyDate);
    }, [db]);

    const selectedSessionGame = selectedGame && getSessionGame(selectedGame.title);
    const discardRun = (id: string) => {
        Alert.alert('Discard incompatible save?', 'This unfinished game cannot be opened. Other games and scores will not be changed.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Discard', style: 'destructive', onPress: () => {
                void discard(id).catch(cause => {
                    console.error('Could not discard saved game:', cause);
                    Alert.alert('Unable to discard saved game', 'Try again from the game picker.');
                });
            } },
        ]);
    };
    return (
        <ScrollView style={styles.container}>
            <FadeInView duration={600}>
                <GameSelector
                    handleSelectGame={handleSelectGame}
                />
                {selectedGame && (
                    <SelectGame
                        visible={showSelectGame}
                        game={selectedGame}
                        close={handleCloseModal}
                        difficulties={Difficulties[selectedGame.title as GameTitle]}
                        selectGame={confirmSelectGame}
                        savedRuns={runs.filter(run => run.identity.gameId === selectedGame.id)}
                        continueGame={continueGame}
                        checkDailyCompleted={checkDailyCompleted}
                        sessionError={selectedSessionGame ? error : null}
                        sessionsLoading={Boolean(selectedSessionGame) && loading}
                        retrySessions={refresh}
                        unavailableRuns={unavailable.filter(run => run.gameId === selectedGame.id)}
                        discardRun={discardRun}
                    />
                )}
            </FadeInView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 8,
    },
});
