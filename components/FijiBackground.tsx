import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
} from "react-native";

const { width: SW, height: SH } = Dimensions.get("window");

const ASSETS: Record<string, ImageSourcePropType> = {
  clouds: require("../assets/images/backgrounds/IslandView/Clouds.png"),
  mountainBack: require("../assets/images/backgrounds/IslandView/mountain-back.png"),
  mountainMid: require("../assets/images/backgrounds/IslandView/mountain-mid.png"),
  mountainFront: require("../assets/images/backgrounds/IslandView/mountain-front.png"),
  sand: require("../assets/images/backgrounds/IslandView/sand.png"),
  waterDeep: require("../assets/images/backgrounds/IslandView/water-deep.png"),
  waterMid: require("../assets/images/backgrounds/IslandView/water-mid.png"),
  waterShallow: require("../assets/images/backgrounds/IslandView/water-shallow.png"),
};

// ── Vertical positions as fractions of SH ─────────────────────────────────────
const Y = {
  clouds: 0.02,
  mountainBack: 0.3,
  mountainMid: 0.35,
  mountainFront: 0.4,
  sand: 0.5,
  waterDeep: 0.9,
  waterMid: 0.8,
  waterShallow: 0.72,
};

// ── Layer heights as fractions of SH ──────────────────────────────────────────
const H = {
  clouds: 0.2,
  mountainBack: 0.25,
  mountainMid: 0.25,
  mountainFront: 0.25,
  sand: 0.25,
  waterDeep: 0.12,
  waterMid: 0.12,
  waterShallow: 0.12,
};

// ── Scroll speeds px/sec (far = slow, near = fast) ────────────────────────────
const SPEEDS = {
  clouds: 3,
  mountainBack: 8,
  mountainMid: 16,
  mountainFront: 22,
  sand: 28,
};

// ─── Scroll animation hook ────────────────────────────────────────────────────
function useScrollAnim(speed: number, loopWidth: number = SW): Animated.Value {
  const x = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(x, {
        toValue: -loopWidth,
        duration: (loopWidth / speed) * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [loopWidth]);
  return x;
}

// ─── A single scrolling image layer (tiled twice for seamless loop) ───────────
interface ScrollLayerProps {
  source: ImageSourcePropType;
  animX: Animated.Value;
  top: number;
  height: number;
}

interface ScrollLayerProps {
  source: ImageSourcePropType;
  animX: Animated.Value;
  top: number;
  height: number;
  resizeMode?: "stretch" | "contain" | "cover";
}

function ScrollLayer({
  source,
  animX,
  top,
  height,
  resizeMode = "stretch",
}: ScrollLayerProps) {
  const { width: imgW } = Image.resolveAssetSource(source);

  return (
    <Animated.View
      style={[
        styles.scrollLayer,
        { top, height, transform: [{ translateX: animX }] },
      ]}
    >
      <Image
        source={source}
        style={{ width: imgW, height }}
        resizeMode={resizeMode}
      />
      <Image
        source={source}
        style={{ width: imgW, height }}
        resizeMode={resizeMode}
      />
    </Animated.View>
  );
}

// ─── A static image layer (water strips don't scroll) ────────────────────────
interface StaticLayerProps {
  source: ImageSourcePropType;
  top: number;
  height: number;
}

function StaticLayer({
  source,
  top,
  height,
}: StaticLayerProps): React.ReactElement {
  const { width: imgW } = Image.resolveAssetSource(source);

  return (
    <Image
      source={source}
      style={[styles.staticLayer, { top, height, width: imgW }]}
      resizeMode="stretch"
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface FijiBackgroundProps {
  children?: React.ReactNode;
}

export default function FijiBackground({
  children,
}: FijiBackgroundProps): React.ReactElement {
  // Resolve natural image widths for seamless loop points
  const imgW = {
    clouds: Image.resolveAssetSource(ASSETS.clouds).width,
    mountainBack: Image.resolveAssetSource(ASSETS.mountainBack).width,
    mountainMid: Image.resolveAssetSource(ASSETS.mountainMid).width,
    mountainFront: Image.resolveAssetSource(ASSETS.mountainFront).width,
    sand: Image.resolveAssetSource(ASSETS.sand).width,
  };

  const xClouds = useScrollAnim(SPEEDS.clouds, imgW.clouds);
  const xMountainBack = useScrollAnim(SPEEDS.mountainBack, imgW.mountainBack);
  const xMountainMid = useScrollAnim(SPEEDS.mountainMid, imgW.mountainMid);
  const xMountainFront = useScrollAnim(
    SPEEDS.mountainFront,
    imgW.mountainFront,
  );
  const xSand = useScrollAnim(SPEEDS.sand, imgW.sand);

  return (
    <View style={styles.container}>
      {/* 1. Sky — furthest back */}
      <View style={styles.sky} />

      {/* 2. Sand — behind mountains */}
      <ScrollLayer
        source={ASSETS.sand}
        animX={xSand}
        top={Y.sand * SH}
        height={H.sand * SH}
      />

      {/* 3. Mountains — back to front */}
      <ScrollLayer
        source={ASSETS.mountainBack}
        animX={xMountainBack}
        top={Y.mountainBack * SH}
        height={H.mountainBack * SH}
      />
      <ScrollLayer
        source={ASSETS.mountainMid}
        animX={xMountainMid}
        top={Y.mountainMid * SH}
        height={H.mountainMid * SH}
      />
      <ScrollLayer
        source={ASSETS.mountainFront}
        animX={xMountainFront}
        top={Y.mountainFront * SH}
        height={H.mountainFront * SH}
      />

      {/* 4. Clouds — above mountains */}
      <ScrollLayer
        source={ASSETS.clouds}
        animX={xClouds}
        top={Y.clouds * SH}
        height={H.clouds * SH}
        resizeMode="contain"
      />
      {/* 5. Water — deep first, shallow on top */}
      <StaticLayer
        source={ASSETS.waterShallow}
        top={Y.waterShallow * SH}
        height={H.waterShallow * SH}
      />

      <StaticLayer
        source={ASSETS.waterMid}
        top={Y.waterMid * SH}
        height={H.waterMid * SH}
      />
      <StaticLayer
        source={ASSETS.waterDeep}
        top={Y.waterDeep * SH}
        height={H.waterDeep * SH}
      />

      {/* Screen content slot */}
      {children != null && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#3ecfea",
  },
  sky: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#3ecfea",
  },
  scrollLayer: {
    position: "absolute",
    left: 0,
    flexDirection: "row",
  },
  staticLayer: {
    position: "absolute",
    left: 0,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
  },
});
