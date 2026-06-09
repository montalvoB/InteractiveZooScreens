import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Colors } from "@/constants/theme";

// Put these two files in: assets/images/elements/
const normalIguanaPage = require("../assets/images/elements/img-normal.jpg");
const skeletonIguanaPage = require("../assets/images/elements/IguanaSkeleton.jpg");

const LENS_SIZE = 145;
const DESIGN_WIDTH = 1080;
const DESIGN_HEIGHT = 1920;
const IMAGE_ASPECT_RATIO = DESIGN_WIDTH / DESIGN_HEIGHT;

type Point = {
  x: number;
  y: number;
};

type Zone = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  title: string;
  text: string;
};

const ZONES: Zone[] = [
  {
    x1: 0,
    y1: 960,
    x2: 270,
    y2: 1260,
    title: "STRONG JAWS AND TEETH",
    text: "Their teeth are tall and pointy, adapted to break down their fibrous plant diet.",
  },
  {
    x1: 0,
    y1: 1300,
    x2: 290,
    y2: 1700,
    title: "LONG TOES AND CLAWS",
    text: "They are perfect for grabbing branches, helping them climb during the day and stay stable while sleeping at night.",
  },
  {
    x1: 240,
    y1: 960,
    x2: 680,
    y2: 1380,
    title: "RIBCAGE AND SPINE",
    text: "A long flexible spine and curved ribs protect vital organs while letting the iguana twist through dense tropical vegetation.",
  },
  {
    x1: 500,
    y1: 1200,
    x2: 860,
    y2: 1650,
    title: "PELVIS AND REAR CLAWS",
    text: "Large rear claws grip rough bark and rocky surfaces, and fold back when diving into water to reduce drag.",
  },
  {
    x1: 650,
    y1: 980,
    x2: 1080,
    y2: 1320,
    title: "TAIL VERTEBRAE",
    text: "The tail can have up to 70 vertebrae and can be shed and regrown as a defence — a process called autotomy.",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function IguanaXRayScreen() {
  const { width, height } = useWindowDimensions();
  const [scanning, setScanning] = useState(false);
  const [screenSize, setScreenSize] = useState({ width, height });
  const [lens, setLens] = useState<Point>({
    x: width / 2 - LENS_SIZE / 2,
    y: height / 2 - LENS_SIZE / 2,
  });

  const imageRect = useMemo(() => {
    const screenAspect = screenSize.width / screenSize.height;

    if (screenAspect > IMAGE_ASPECT_RATIO) {
      const imageHeight = screenSize.height;
      const imageWidth = imageHeight * IMAGE_ASPECT_RATIO;
      return {
        width: imageWidth,
        height: imageHeight,
        left: (screenSize.width - imageWidth) / 2,
        top: 0,
      };
    }

    const imageWidth = screenSize.width;
    const imageHeight = imageWidth / IMAGE_ASPECT_RATIO;
    return {
      width: imageWidth,
      height: imageHeight,
      left: 0,
      top: (screenSize.height - imageHeight) / 2,
    };
  }, [screenSize.width, screenSize.height]);

  const activeZone = useMemo(() => {
    if (!scanning) return null;

    const lensCenterScreenX = lens.x + LENS_SIZE / 2;
    const lensCenterScreenY = lens.y + LENS_SIZE / 2;

    // Convert screen pixels back into the original 1080 x 1920 design coordinates.
    const designX = ((lensCenterScreenX - imageRect.left) / imageRect.width) * DESIGN_WIDTH;
    const designY = ((lensCenterScreenY - imageRect.top) / imageRect.height) * DESIGN_HEIGHT;

    return (
      ZONES.find(
        (zone) =>
          designX >= zone.x1 &&
          designX <= zone.x2 &&
          designY >= zone.y1 &&
          designY <= zone.y2,
      ) ?? null
    );
  }, [imageRect.height, imageRect.left, imageRect.top, imageRect.width, lens.x, lens.y, scanning]);

  const bubblePosition = useMemo(() => {
    const bubbleWidth = Math.min(260, screenSize.width - 28);
    const bubbleHeight = 145;

    let left = lens.x + LENS_SIZE + 12;
    let top = lens.y - 4;

    if (left + bubbleWidth > screenSize.width - 14) {
      left = lens.x - bubbleWidth - 12;
    }

    return {
      width: bubbleWidth,
      left: clamp(left, 14, screenSize.width - bubbleWidth - 14),
      top: clamp(top, 14, screenSize.height - bubbleHeight - 14),
    };
  }, [lens.x, lens.y, screenSize.height, screenSize.width]);

  const updateLens = (locationX: number, locationY: number) => {
    setLens({
      x: clamp(locationX - LENS_SIZE / 2, 0, screenSize.width - LENS_SIZE),
      y: clamp(locationY - LENS_SIZE / 2, 0, screenSize.height - LENS_SIZE),
    });
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    const nextHeight = event.nativeEvent.layout.height;
    setScreenSize({ width: nextWidth, height: nextHeight });
  };

  return (
    <View
      style={styles.container}
      onLayout={handleLayout}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={(event) => {
        setScanning(true);
        updateLens(event.nativeEvent.locationX, event.nativeEvent.locationY);
      }}
      onResponderMove={(event) => {
        updateLens(event.nativeEvent.locationX, event.nativeEvent.locationY);
      }}
      onResponderRelease={() => undefined}
      onResponderTerminate={() => undefined}
    >
      <Image
        source={normalIguanaPage}
        style={[
          styles.pageImage,
          {
            left: imageRect.left,
            top: imageRect.top,
            width: imageRect.width,
            height: imageRect.height,
          },
        ]}
        resizeMode="stretch"
      />

      {scanning && (
        <View
          pointerEvents="none"
          style={[
            styles.lensWrapper,
            {
              left: lens.x,
              top: lens.y,
            },
          ]}
        >
          <View style={styles.lensRing}>
            <View style={styles.lensClip}>
              <Image
                source={skeletonIguanaPage}
                resizeMode="stretch"
                style={[
                  styles.skeletonImage,
                  {
                    width: imageRect.width,
                    height: imageRect.height,
                    left: imageRect.left - lens.x,
                    top: imageRect.top - lens.y,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      )}

      {scanning && activeZone && (
        <View
          pointerEvents="none"
          style={[
            styles.infoBubble,
            {
              width: bubblePosition.width,
              left: bubblePosition.left,
              top: bubblePosition.top,
            },
          ]}
        >
          <Text style={styles.infoTitle}>{activeZone.title}</Text>
          <Text style={styles.infoText}>{activeZone.text}</Text>
        </View>
      )}

      <View
        pointerEvents="box-none"
        style={[
          styles.figmaHeader,
          {
            left: imageRect.left,
            top: imageRect.top,
            width: imageRect.width,
            height: imageRect.height * 0.322,
          },
        ]}
      >
        <Text style={styles.figmaTitle}>FIJI BANDED IGUANA</Text>
        <Text style={styles.figmaSubtitle}>
          Research Study: Fiji Banded Iguana X-Ray
        </Text>
        <Text style={styles.figmaCaption}>
          Drag the scanner over the iguana to reveal its skeleton and learn about
          its anatomy
        </Text>
        <TouchableOpacity
          onPress={() => setScanning(true)}
          activeOpacity={0.8}
          style={[
            styles.scannerButton,
            scanning && styles.scannerButtonActive,
          ]}
        >
          {scanning && (
            <FontAwesome5
              name="bone"
              size={18}
              color={Colors.white}
              style={styles.scannerIcon}
            />
          )}
          <Text style={styles.scannerButtonText}>
            {scanning ? "Scanning... gathering research" : "TAP FOR THE SCANNER"}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        pointerEvents="box-none"
        style={[
          styles.bottomNav,
          {
            left: imageRect.left + imageRect.width * 0.04,
            top: imageRect.top + imageRect.height * 0.887,
            width: imageRect.width * 0.92,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.replace("/HomeScreen")}
          activeOpacity={0.8}
          style={styles.backPill}
        >
          <FontAwesome5 name="chevron-left" size={22} color={Colors.darkGreen} />
          <Text style={styles.backPillText}>Back to research station</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/AnimalVisionScreen")}
          activeOpacity={0.8}
          style={styles.nextCircle}
        >
          <FontAwesome5 name="chevron-right" size={26} color={Colors.darkGreen} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  pageImage: {
    position: "absolute",
  },
  figmaHeader: {
    position: "absolute",
    zIndex: 25,
    backgroundColor: Colors.cream,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    paddingHorizontal: "11.5%",
    paddingTop: "11.5%",
  },
  figmaTitle: {
    fontFamily: "NeueFrutigerWorld-Black",
    fontSize: 29,
    color: Colors.darkGreen,
    letterSpacing: 0,
  },
  figmaSubtitle: {
    fontFamily: "NeueFrutigerWorld-Bold",
    fontSize: 16,
    color: Colors.limeGreen,
    marginTop: 14,
  },
  figmaCaption: {
    fontFamily: "NationalPark-Regular",
    fontSize: 10,
    lineHeight: 14,
    color: Colors.green,
    marginTop: 8,
    maxWidth: "90%",
  },
  scannerButton: {
    position: "absolute",
    left: "15%",
    right: "15%",
    bottom: "9%",
    height: 48,
    borderRadius: 24,
    backgroundColor: "#A6C600",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 18,
  },
  scannerButtonActive: {
    justifyContent: "flex-start",
  },
  scannerIcon: {
    marginRight: 18,
  },
  scannerButtonText: {
    fontFamily: "NeueFrutigerWorld-Bold",
    fontSize: 13,
    color: Colors.darkGreen,
  },
  lensWrapper: {
    position: "absolute",
    width: LENS_SIZE,
    height: LENS_SIZE,
    alignItems: "center",
    zIndex: 10,
  },
  lensRing: {
    width: LENS_SIZE,
    height: LENS_SIZE,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: "#7ab8ff",
    shadowColor: "#7ab8ff",
    shadowOpacity: 0.9,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  lensClip: {
    width: LENS_SIZE,
    height: LENS_SIZE,
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
  },
  skeletonImage: {
    position: "absolute",
  },
  infoBubble: {
    position: "absolute",
    zIndex: 15,
    backgroundColor: "rgba(245,255,232,0.97)",
    borderColor: "#A5BC39",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#24442D",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#296029",
    fontWeight: "700",
  },
  bottomNav: {
    position: "absolute",
    zIndex: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backPill: {
    minWidth: "50%",
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.yellow,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    gap: 10,
  },
  backPillText: {
    fontFamily: "NeueFrutigerWorld-Bold",
    color: Colors.darkGreen,
    fontSize: 14,
  },
  nextCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
});
