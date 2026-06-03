import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import FijiBackground from "./FijiBackground";

export default function IslandView() {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;
  const blurOpacity = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current; // fade the whole scene

  function handleTap() {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 2,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(blurOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.replace("/HomeScreen");
    });
  }

  return (
    // Outer container: black bg + clips the zooming view
    <View style={styles.outer}>
      <Animated.View
        style={[styles.container, { transform: [{ scale }] }]}
        onTouchStart={handleTap}
      >
        <FijiBackground />

        <Animated.View
          style={[StyleSheet.absoluteFillObject, { opacity: blurOpacity }]}
        >
          <BlurView
            intensity={100}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  container: {
    flex: 1,
  },
});
