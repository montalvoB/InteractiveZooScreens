/*
Credits to https://github.com/meliorence/react-native-snap-carousel/tree/master
*/

import { useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const CARD_WIDTH = width * 0.72;
const CARD_HEIGHT = height * 0.48;
const SPACING = 18;
const SNAP_INTERVAL = CARD_WIDTH + SPACING;

export type CarouselCardItem = {
  title: string;
  subtitle: string;
  image: string;
};

type CarouselCardsProps = {
  cards: CarouselCardItem[];
};

export default function CarouselCards({ cards }: CarouselCardsProps) {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <Animated.FlatList
      style={styles.list}
      data={cards}
      keyExtractor={(item) => item.title}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={SNAP_INTERVAL}
      decelerationRate="fast"
      bounces={false}
      contentContainerStyle={styles.carouselContent}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
      renderItem={({ item, index }) => {
        const inputRange = [
          (index - 1) * SNAP_INTERVAL,
          index * SNAP_INTERVAL,
          (index + 1) * SNAP_INTERVAL,
        ];

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.9, 1, 0.9],
          extrapolate: 'clamp',
        });

        const translateY = scrollX.interpolate({
          inputRange,
          outputRange: [22, 0, 22],
          extrapolate: 'clamp',
        });

        const rotate = scrollX.interpolate({
          inputRange,
          outputRange: ['-3deg', '0deg', '3deg'],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ scale }, { translateY }, { rotate }],
              },
            ]}
          >
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.image}
              imageStyle={styles.imageRadius}
            >
              <View style={styles.overlay}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>
            </ImageBackground>
          </Animated.View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
    flexGrow: 0,
  },
  carouselContent: {
    paddingLeft: 34,
    paddingRight: width - CARD_WIDTH - 34,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: SPACING,
    borderRadius: 8,
    backgroundColor: '#111',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageRadius: {
    borderRadius: 8,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.72)',
    paddingHorizontal: 22,
    paddingVertical: 20,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardSubtitle: {
    color: '#cfcfcf',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 8,
  },
});