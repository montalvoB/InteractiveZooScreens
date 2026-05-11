import { router } from "expo-router";
import { useRef, useState, RefObject } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const background = require("../assets/images/backgrounds/Beach.png");
const iguana = require("../assets/images/elements/Iguana.png");

function DraggableImage({
  image,
  label,
  onDropInsideBox,
  boxRef,
}: {
  image: any;
  label: string;
  onDropInsideBox: () => void;
  boxRef: RefObject<View | null>;
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const [visible, setVisible] = useState(true);

  const imageSize = 76;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),

        onPanResponderRelease: (_, gesture) => {
          boxRef.current?.measureInWindow((x, y, width, height) => {
            const droppedX = gesture.moveX;
            const droppedY = gesture.moveY;

            const insideBox =
              droppedX >= x &&
              droppedX <= x + width &&
              droppedY >= y &&
              droppedY <= y + height;

            if (insideBox) {
              setVisible(false);
              onDropInsideBox();
            } else {
              Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: false,
              }).start();
            }
          });
        },
    })
  ).current;

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.draggableItem,
        {
          transform: pan.getTranslateTransform(),
        },
      ]}
    >
      <Image
        source={image}
        style={{ width: imageSize, height: imageSize }}
        resizeMode="contain"
      />
      <Text style={styles.dragLabel}>{label}</Text>
    </Animated.View>
  );
}

export default function DragDropScreen() {
  const boxRef = useRef<View>(null);
  const [droppedCount, setDroppedCount] = useState(0);

  return (
    <View style={styles.container}>
      <ImageBackground source={background} style={styles.background}>
        <Text style={styles.title}>Drag & Drop</Text>
        <Text style={styles.subtitle}>
          Drag the small images into the habitat box.
        </Text>

        <View style={styles.gameArea}>
          <View style={styles.dragRow}>
            <DraggableImage
              image={iguana}
              label="Iguana"
              boxRef={boxRef}
              onDropInsideBox={() => setDroppedCount((count) => count + 1)}
            />

            <DraggableImage
              image={iguana}
              label="Food"
              boxRef={boxRef}
              onDropInsideBox={() => setDroppedCount((count) => count + 1)}
            />

            <DraggableImage
              image={iguana}
              label="Leaf"
              boxRef={boxRef}
              onDropInsideBox={() => setDroppedCount((count) => count + 1)}
            />
          </View>

            <View ref={boxRef} style={styles.dropBox}>
            <Text style={styles.dropBoxTitle}>Habitat Box</Text>
            <Text style={styles.dropBoxText}>
              Dropped items: {droppedCount}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/InfoCardsScreen")}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back to Cards</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  background: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingTop: 80,
  },
  title: {
    fontSize: 38,
    fontWeight: "300",
    color: "#0a0a0a",
    letterSpacing: 6,
    textTransform: "uppercase",
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: "#222",
    paddingHorizontal: 32,
    textAlign: "center",
  },
  gameArea: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  dragRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  draggableItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  dragLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
  },
  dropBox: {
    width: "72%",
    height: 180,
    borderRadius: 24,
    borderWidth: 3,
    borderStyle: "dashed",
    borderColor: "#333",
    backgroundColor: "rgba(255,255,255,0.68)",
    alignItems: "center",
    justifyContent: "center",
  },
  dropBoxTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
  },
  dropBoxText: {
    marginTop: 8,
    fontSize: 16,
    color: "#333",
  },
  backButton: {
    marginBottom: 48,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 14,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});