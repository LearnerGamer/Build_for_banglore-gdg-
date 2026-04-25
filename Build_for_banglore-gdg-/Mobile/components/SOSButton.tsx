import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Shield } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface SOSButtonProps {
  onSOS: () => void;
  isActive: boolean;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ onSOS, isActive }) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let interval: any;
    if (isHolding && !isActive) {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();

      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            onSOS();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setIsHolding(false);
            return 100;
          }
          if (prev % 10 === 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          return prev + 2;
        });
      }, 60);
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding, isActive]);

  return (
    <Pressable
      onPressIn={() => setIsHolding(true)}
      onPressOut={() => setIsHolding(false)}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: isActive ? '#ff3b30' : '#8b0000' }
      ]}
    >
      <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
        <Shield size={32} color="white" />
        <Text style={styles.text}>{isActive ? 'SOS ACTIVE' : 'HOLD 3s'}</Text>
        
        {isHolding && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#ff3b30',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 8,
    fontWeight: '900',
    marginTop: 4,
  },
  progressContainer: {
    position: 'absolute',
    bottom: -15,
    width: 60,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
  },
});
