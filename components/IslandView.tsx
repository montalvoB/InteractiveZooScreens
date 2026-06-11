import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SCREEN_W } = Dimensions.get("window");

function LoopingLayer({
  source,
  speed,
  imageWidth,
  top,
  height,
  scale: layerScale,
}: {
  source: ImageSourcePropType;
  speed: number;
  imageWidth: number;
  top?: number | `${number}%`;
  height?: number | `${number}%`;
  scale?: number;
}) {
  const offsetX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const duration = (imageWidth / speed) * 1000;
    let anim: Animated.CompositeAnimation;

    function cycle() {
      anim = Animated.timing(offsetX, {
        toValue: -imageWidth,
        duration,
        useNativeDriver: true,
      });
      anim.start(({ finished }) => {
        if (finished) {
          offsetX.setValue(0);
          cycle();
        }
      });
    }

    cycle();
    return () => anim?.stop();
  }, [imageWidth, speed]);

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          top: top ?? 0,
          height: height ?? "100%",
          flexDirection: "row",
          transform: [
            { scale: layerScale ?? 1 },
            { translateX: offsetX },
          ],
        },
      ]}
    >
      <Image
        source={source}
        style={{ width: imageWidth, height: "100%" }}
        resizeMode="contain"
      />
      <Image
        source={source}
        style={{ width: imageWidth, height: "100%" }}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------

export default function IslandView() {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;
  const blurOpacity = useRef(new Animated.Value(0)).current;

  const tapPulse = useRef(new Animated.Value(1)).current;
  const rippleOpacity = useRef(new Animated.Value(0.6)).current;
  const rippleScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Outer dot gentle pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(tapPulse, {
          toValue: 1.12,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(tapPulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Ripple expands outward and fades
    Animated.loop(
      Animated.parallel([
        Animated.timing(rippleScale, {
          toValue: 2.2,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(rippleOpacity, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const cloudsW = SCREEN_W * 2;
  const islandsW = SCREEN_W * 1.2;

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
    <View style={styles.outer}>
      <Animated.View
        style={[styles.container, { transform: [{ scale }] }]}
        onTouchStart={handleTap}
      >
        {/* ── Layer 1: static deep-water background ── */}
        <Image
          source={require("../assets/images/backgrounds/deep-water.png")}
          style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]}
          resizeMode="contain"
        />

        {/* ── Layer 2: clouds — slow drift ── */}
        <LoopingLayer
          source={require("../assets/images/elements/blurred-clouds.png")}
          speed={10}
          imageWidth={cloudsW}
          top={20}
          height="60%"
        />

        {/* ── Layer 3: islands — faster drift ── */}
        <LoopingLayer
          source={require("../assets/images/elements/two-islands.png")}
          speed={15}
          imageWidth={islandsW}
          top="30%"
          scale={1.1}
        />

        {/* ── Tap to explore prompt ── */}
        <Animated.View
          style={[styles.tapPrompt, { transform: [{ scale: tapPulse }] }]}
        >
          {/* Ripple ring */}
          <View style={styles.tapRingContainer}>
            <Animated.View
              style={[
                styles.ripple,
                { transform: [{ scale: rippleScale }], opacity: rippleOpacity },
              ]}
            />
            <View style={styles.dot} />
          </View>
          <Text style={styles.tapLabel}>Tap to Explore</Text>
        </Animated.View>

        {/* ── Tap-to-enter blur overlay ── */}
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: blurOpacity }]}
        >
          <BlurView
            intensity={100}
            tint="dark"
            style={StyleSheet.absoluteFill}
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
  tapPrompt: {
    position: "absolute",
    bottom: "12%",
    alignSelf: "center",
    alignItems: "center",
    gap: 10,
  },
  tapRingContainer: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  ripple: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.8)",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#fff",
  },
  tapLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});