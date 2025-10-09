import React, { useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width, height } = Dimensions.get('window');

/**
 * ConfettiTestScreen - Demo component showing confetti particle effects
 * Demonstrates react-native-confetti-cannon usage
 */
export function ConfettiTestScreen() {
  const basicConfettiRef = useRef<any>(null);
  const customConfettiRef = useRef<any>(null);
  const centerConfettiRef = useRef<any>(null);
  
  const triggerBasicConfetti = () => {
    basicConfettiRef.current?.start();
  };
  
  const triggerCustomConfetti = () => {
    customConfettiRef.current?.start();
  };
  
  const triggerCenterConfetti = () => {
    centerConfettiRef.current?.start();
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confetti Cannon Examples</Text>
      <Text style={styles.subtitle}>Particle Effects for Celebrations</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={triggerBasicConfetti}>
          <Text style={styles.buttonText}>🎉 Basic Confetti</Text>
          <Text style={styles.buttonSubtext}>From top-left corner</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.customButton]} 
          onPress={triggerCustomConfetti}
        >
          <Text style={styles.buttonText}>⭐ Custom Colors</Text>
          <Text style={styles.buttonSubtext}>Theme-specific confetti</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.centerButton]} 
          onPress={triggerCenterConfetti}
        >
          <Text style={styles.buttonText}>💥 Center Burst</Text>
          <Text style={styles.buttonSubtext}>Explosion from center</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>💡 Use Cases:</Text>
        <Text style={styles.infoText}>• Game completion celebrations</Text>
        <Text style={styles.infoText}>• High score achievements</Text>
        <Text style={styles.infoText}>• Level up effects</Text>
        <Text style={styles.infoText}>• Streak milestones</Text>
        <Text style={styles.infoText}>• Perfect game bonuses</Text>
      </View>
      
      {/* Basic Confetti - Default settings from top-left */}
      <ConfettiCannon
        ref={basicConfettiRef}
        count={150}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
        fadeOut
      />
      
      {/* Custom Confetti - Custom colors and settings */}
      <ConfettiCannon
        ref={customConfettiRef}
        count={200}
        origin={{ x: width, y: 0 }}
        autoStart={false}
        fadeOut
        explosionSpeed={350}
        fallSpeed={2500}
        colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']}
      />
      
      {/* Center Burst Confetti */}
      <ConfettiCannon
        ref={centerConfettiRef}
        count={180}
        origin={{ x: width / 2, y: height / 2 }}
        autoStart={false}
        fadeOut
        explosionSpeed={400}
        fallSpeed={2000}
      />
      
      <Text style={styles.footer}>
        ✅ Confetti Cannon is working correctly!
      </Text>
    </View>
  );
}

/**
 * GameVictoryConfetti - Reusable component for game completion
 * Example of how to integrate confetti into game completion screens
 */
interface GameVictoryConfettiProps {
  visible: boolean;
  onComplete?: () => void;
}

export function GameVictoryConfetti({ visible, onComplete }: GameVictoryConfettiProps) {
  const confettiRef = useRef<any>(null);
  
  React.useEffect(() => {
    if (visible) {
      confettiRef.current?.start();
      
      // Optional: trigger again after a delay for double celebration
      const timeout = setTimeout(() => {
        confettiRef.current?.start();
      }, 1500);
      
      // Call onComplete after animations
      const completeTimeout = setTimeout(() => {
        onComplete?.();
      }, 3000);
      
      return () => {
        clearTimeout(timeout);
        clearTimeout(completeTimeout);
      };
    }
  }, [visible, onComplete]);
  
  if (!visible) return null;
  
  return (
    <ConfettiCannon
      ref={confettiRef}
      count={200}
      origin={{ x: width / 2, y: 0 }}
      autoStart={false}
      fadeOut
      explosionSpeed={400}
      colors={['#FFD700', '#FFA500', '#FF6347', '#00FF00', '#00CED1']}
    />
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
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  customButton: {
    backgroundColor: '#4ECDC4',
  },
  centerButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  buttonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
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
  footer: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
});
