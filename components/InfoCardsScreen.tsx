import { useRef, useEffect } from 'react';
import { Text, View, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function InfoCardsScreen() {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <TouchableOpacity onPress={() => router.replace('/')} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f0',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
  },
  commonName: {
    fontSize: 32,
    fontWeight: '600',
    color: '#0a0a0a',
    letterSpacing: 1,
    textAlign: 'center',
  },
  scientificNameBadge: {
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 10,
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#444',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 40,
    padding: 12,
  },
  backButtonText: {
    fontSize: 14,
    color: '#555',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginTop: "100%",
  },
});