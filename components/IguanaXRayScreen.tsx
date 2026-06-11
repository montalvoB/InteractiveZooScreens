import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Colors } from "@/constants/theme";
import { BodyText, DisplayHeading, SubHeading1 } from "@/components/Typography";

const skeletonIguanaPage = require("../assets/images/elements/IguanaSkeleton.jpg");
const xrayScene = require("../assets/images/xray/xray-scene.png");
const backButtonImage = require("../assets/images/xray/xray-back-button.png");
const nextButtonImage = require("../assets/images/xray/xray-next-button.png");
const tapScannerButtonImage = require("../assets/images/xray/xray-tap-scanner-button.png");

const LENS_SIZE = 145;
const DESIGN_WIDTH = 1080;
const DESIGN_HEIGHT = 1920;
const IMAGE_ASPECT_RATIO = DESIGN_WIDTH / DESIGN_HEIGHT;
const HEADER_HEIGHT = 0.322;
const SCENE_TOP = 0.382;
const SCENE_ASPECT_RATIO = 2160 / 2330;
const SCANNER_MIN_TOP = 0.44;
const SCANNER_MAX_TOP = 0.82;

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
    const bubbleWidth = Math.min(270, screenSize.width - 28);
    const bubbleHeight = 150;
    const habitatTop = imageRect.top + imageRect.height * HEADER_HEIGHT;

    const left = lens.x + LENS_SIZE + 12;
    const top = lens.y;

    return {
      width: bubbleWidth,
      left: clamp(left, 14, screenSize.width - bubbleWidth - 14),
      top: clamp(top, habitatTop + 14, screenSize.height - bubbleHeight - 14),
    };
  }, [imageRect.height, imageRect.top, lens.x, lens.y, screenSize.height, screenSize.width]);

  const scannerBounds = useMemo(() => {
    const minY = imageRect.top + imageRect.height * SCANNER_MIN_TOP;
    return {
      minX: imageRect.left,
      maxX: imageRect.left + imageRect.width - LENS_SIZE,
      minY,
      maxY: imageRect.top + imageRect.height * SCANNER_MAX_TOP,
    };
  }, [imageRect.height, imageRect.left, imageRect.top, imageRect.width]);

  const sceneFrame = useMemo(() => {
    const width = imageRect.width;
    const height = width / SCENE_ASPECT_RATIO;
    return {
      left: imageRect.left,
      top: imageRect.top + imageRect.height * SCENE_TOP,
      width,
      height,
    };
  }, [imageRect.height, imageRect.left, imageRect.top, imageRect.width]);

  const updateLens = (locationX: number, locationY: number) => {
    setLens({
      x: clamp(locationX - LENS_SIZE / 2, scannerBounds.minX, scannerBounds.maxX),
      y: clamp(locationY - LENS_SIZE / 2, scannerBounds.minY, scannerBounds.maxY),
    });
  };

  const updateLensFromTouch = (event: GestureResponderEvent) => {
    updateLens(event.nativeEvent.pageX, event.nativeEvent.pageY);
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
      onStartShouldSetResponder={() => scanning}
      onMoveShouldSetResponder={() => scanning}
      onResponderGrant={(event) => {
        updateLensFromTouch(event);
      }}
      onResponderMove={(event) => {
        updateLensFromTouch(event);
      }}
      onResponderRelease={() => undefined}
      onResponderTerminate={() => undefined}
    >
      <View
        style={[
          styles.habitatBackground,
          {
            left: imageRect.left,
            top: imageRect.top + imageRect.height * HEADER_HEIGHT,
            width: imageRect.width,
            height: imageRect.height * (1 - HEADER_HEIGHT),
          },
        ]}
      />
      <Image
        source={xrayScene}
        style={[styles.sceneImage, sceneFrame]}
        resizeMode="contain"
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
          <SubHeading1 style={styles.infoTitle}>{activeZone.title}</SubHeading1>
          <BodyText style={styles.infoText}>{activeZone.text}</BodyText>
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
            height: imageRect.height * HEADER_HEIGHT,
          },
        ]}
      >
        <DisplayHeading style={styles.figmaTitle}>FIJI BANDED IGUANA</DisplayHeading>
        <SubHeading1 style={styles.figmaSubtitle}>
          Research Study: Fiji Banded Iguana X-Ray
        </SubHeading1>
        <BodyText style={styles.figmaCaption}>
          Drag the scanner over the iguana to reveal its skeleton and learn about
          its anatomy
        </BodyText>
        <TouchableOpacity
          onPress={() => setScanning(true)}
          activeOpacity={0.8}
          style={scanning ? styles.scannerButton : styles.tapScannerButton}
        >
          {scanning ? (
            <>
              <FontAwesome5
                name="bone"
                size={18}
                color={Colors.white}
                style={styles.scannerIcon}
              />
              <SubHeading1 style={styles.scannerButtonText}>
                Scanning... gathering research
              </SubHeading1>
            </>
          ) : (
            <Image
              source={tapScannerButtonImage}
              style={styles.tapScannerButtonImage}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </View>

      <View
        pointerEvents="box-none"
        style={[
          styles.bottomNav,
          {
            left: imageRect.left + imageRect.width * 0.04,
            top: imageRect.top + imageRect.height * 0.895,
            width: imageRect.width * 0.92,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.replace("/HomeScreen")}
          activeOpacity={0.86}
          style={styles.backButton}
        >
          <Image
            source={backButtonImage}
            style={styles.backButtonImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/AnimalVisionScreen")}
          activeOpacity={0.86}
          style={styles.nextButton}
        >
          <Image
            source={nextButtonImage}
            style={styles.nextButtonImage}
            resizeMode="contain"
          />
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
  habitatBackground: {
    position: "absolute",
    backgroundColor: "#315A55",
  },
  sceneImage: {
    position: "absolute",
    zIndex: 2,
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
    flexDirection: "row",
    paddingHorizontal: 18,
    justifyContent: "flex-start",
  },
  tapScannerButton: {
    position: "absolute",
    left: "15%",
    right: "15%",
    bottom: "9%",
    aspectRatio: 1510 / 194,
  },
  tapScannerButtonImage: {
    width: "100%",
    height: "100%",
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
    zIndex: 35,
    backgroundColor: "rgba(245,255,232,0.97)",
    borderColor: "#A5BC39",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  infoTitle: {
    fontSize: 14,
    color: "#24442D",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#296029",
  },
  bottomNav: {
    position: "absolute",
    zIndex: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: "50%",
    aspectRatio: 1032 / 194,
  },
  backButtonImage: {
    width: "100%",
    height: "100%",
  },
  nextButton: {
    width: 56,
    height: 56,
  },
  nextButtonImage: {
    width: "100%",
    height: "100%",
  },
});
