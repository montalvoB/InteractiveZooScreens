import { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function InfoCardsScreen() {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={styles.text}>Info Cards</Text>

      <TouchableOpacity onPress={() => router.replace('/')} style={styles.button}>
              <Text style={styles.buttonText}>← Back</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f0',
    alignItems: 'center',
    justifyContent: 'center',
    width,
    height,
  },
  text: {
    fontSize: 52,
    fontWeight: '300',
    color: '#0a0a0a',
    letterSpacing: 12,
    textTransform: 'uppercase',
  },
  button: {
      marginTop: 40,
      padding: 12,
  },
  buttonText: {
    fontSize: 14,
    color: '#555',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
});
