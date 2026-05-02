import { useRef } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const opacity = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('Next');
      // Reset opacity after navigating so back works cleanly
      opacity.setValue(1);
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View style={[styles.container, { opacity }]}>
        <Text style={styles.text}>Home</Text>
        <Text style={styles.hint}>tap anywhere</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    width,
    height,
  },
  text: {
    fontSize: 52,
    fontWeight: '300',
    color: '#f5f5f0',
    letterSpacing: 12,
    textTransform: 'uppercase',
  },
  hint: {
    marginTop: 24,
    fontSize: 12,
    color: '#555',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
});
