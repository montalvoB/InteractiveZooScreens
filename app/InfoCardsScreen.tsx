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
import CarouselCards from './Component/CarouselCards';

const cards = [
  {
    title: 'Early this Morning, NYC',
    subtitle: 'Lorem ipsum dolor sit amet',
    image: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?q=80&w=1200',
  },
  {
    title: 'Animal Vision',
    subtitle: 'See the world differently',
    image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1200',
  },
  {
    title: 'Zoo Experience',
    subtitle: 'Interactive learning cards',
    image: 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?q=80&w=1200',
  },
];

export default function InfoCardsScreen() {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={styles.text}>Info Cards</Text>

      <TouchableOpacity onPress={() => router.replace('/')} style={styles.button}>
              <Text style={styles.buttonText}>← Back</Text>
      </TouchableOpacity>

        <Text style={styles.heading}>Do you want to find out more?</Text>

        <CarouselCards cards={cards} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f0'
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
