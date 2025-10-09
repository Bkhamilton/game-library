import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { 
  AnimationTestScreen, 
  LottieTestScreen, 
  ConfettiTestScreen 
} from '@/components/animations';

/**
 * Animation Test Page
 * 
 * This page demonstrates all three animation libraries:
 * - React Native Reanimated
 * - Lottie React Native
 * - React Native Confetti Cannon
 * 
 * To access this page, add it to your navigation stack in _layout.tsx
 */
export default function AnimationTestPage() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Animation Libraries Test</Text>
        <Text style={styles.headerSubtitle}>
          Demonstrating React Native Reanimated, Lottie, and Confetti Cannon
        </Text>
      </View>
      
      <View style={styles.section}>
        <AnimationTestScreen />
      </View>
      
      <View style={styles.separator} />
      
      <View style={styles.section}>
        <LottieTestScreen />
      </View>
      
      <View style={styles.separator} />
      
      <View style={styles.section}>
        <ConfettiTestScreen />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ✅ All animation libraries are installed and working!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  separator: {
    height: 20,
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    textAlign: 'center',
  },
});
