import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';

/**
 * LottieTestScreen - Demo component showing Lottie animations
 * Demonstrates lottie-react-native usage
 */
export function LottieTestScreen() {
  const loadingAnimationRef = useRef<LottieView>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const toggleAnimation = () => {
    if (isPlaying) {
      loadingAnimationRef.current?.pause();
    } else {
      loadingAnimationRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const resetAnimation = () => {
    loadingAnimationRef.current?.reset();
    setIsPlaying(false);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lottie Animation Examples</Text>
      <Text style={styles.subtitle}>Complex animations from JSON files</Text>
      
      <View style={styles.animationContainer}>
        <LottieView
          ref={loadingAnimationRef}
          source={require('@/assets/animations/loading.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.button, isPlaying && styles.pauseButton]} 
          onPress={toggleAnimation}
        >
          <Text style={styles.buttonText}>
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={resetAnimation}
        >
          <Text style={styles.buttonText}>🔄 Reset</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>💡 Use Cases:</Text>
        <Text style={styles.infoText}>• Loading screens and progress indicators</Text>
        <Text style={styles.infoText}>• Victory and celebration animations</Text>
        <Text style={styles.infoText}>• Success/error feedback effects</Text>
        <Text style={styles.infoText}>• Onboarding and tutorial animations</Text>
        <Text style={styles.infoText}>• Complex character animations</Text>
        <Text style={styles.infoText}>• Theme-specific decorative effects</Text>
      </View>
      
      <View style={styles.noteBox}>
        <Text style={styles.noteTitle}>📝 Note:</Text>
        <Text style={styles.noteText}>
          This is a simple test animation. Production animations should be 
          downloaded from LottieFiles.com or created with Adobe After Effects.
        </Text>
      </View>
      
      <Text style={styles.footer}>
        ✅ Lottie React Native is working correctly!
      </Text>
    </View>
  );
}

/**
 * LoadingSpinner - Reusable Lottie loading component
 * Example of a reusable loading indicator using Lottie
 */
interface LoadingSpinnerProps {
  visible?: boolean;
  size?: number;
}

export function LoadingSpinner({ visible = true, size = 100 }: LoadingSpinnerProps) {
  if (!visible) return null;
  
  return (
    <View style={styles.spinnerContainer}>
      <LottieView
        source={require('@/assets/animations/loading.json')}
        autoPlay
        loop
        style={{ width: size, height: size }}
      />
    </View>
  );
}

/**
 * VictoryAnimation - Reusable victory animation component
 * Example of how to use Lottie for game completion
 */
interface VictoryAnimationProps {
  visible: boolean;
  onComplete?: () => void;
}

export function VictoryAnimation({ visible, onComplete }: VictoryAnimationProps) {
  const animationRef = useRef<LottieView>(null);
  
  React.useEffect(() => {
    if (visible) {
      animationRef.current?.play();
    }
  }, [visible]);
  
  if (!visible) return null;
  
  return (
    <View style={styles.victoryContainer}>
      <LottieView
        ref={animationRef}
        source={require('@/assets/animations/loading.json')}
        autoPlay={false}
        loop={false}
        onAnimationFinish={onComplete}
        style={styles.victoryAnimation}
      />
      <Text style={styles.victoryText}>Victory!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  animationContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 250,
  },
  animation: {
    width: 200,
    height: 200,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pauseButton: {
    backgroundColor: '#FF9500',
  },
  resetButton: {
    backgroundColor: '#5856D6',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 3,
  },
  noteBox: {
    backgroundColor: '#FFF9E6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#856404',
  },
  noteText: {
    fontSize: 12,
    color: '#856404',
    lineHeight: 18,
  },
  footer: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  victoryContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  victoryAnimation: {
    width: 300,
    height: 300,
  },
  victoryText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
});
