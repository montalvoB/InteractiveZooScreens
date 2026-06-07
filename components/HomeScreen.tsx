import { ActionButton, ExploreButton } from "@/components/ui/Buttons";
import { Colors } from "@/constants/theme";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const background = require("../assets/images/backgrounds/Beach.png");
const iguana = require("../assets/images/elements/Iguana.png");
const foreground = require("../assets/images/backgrounds/BeachForeground.png");

const IDLE_TIMEOUT_MS = 30_000;

const RESEARCH_CARDS = [
  {
    title: "Vibrant Coloring",
    description:
      "Male Fiji banded iguanas have bright blue bands or stripes across their green backs, and females are green with pale spots.",
  },
  {
    title: "Island Habitat",
    description:
      "Found exclusively in the tropical rainforests of Fiji's islands, primarily on Vanua Levu and Taveuni.",
  },
  {
    title: "Herbivore Diet",
    description:
      "Fiji iguanas feed almost entirely on leaves, flowers, and fruits, playing an important role in seed dispersal.",
  },
  {
    title: "Territorial Nature",
    description:
      "Males are highly territorial and will head-bob, do push-ups, and change coloration to warn rivals and attract females.",
  },
  {
    title: "Egg Laying",
    description:
      "Females lay a small clutch of 3–6 eggs, incubating for around 170 days — one of the longest periods of any lizard.",
  },
  {
    title: "UV Vision",
    description:
      "Fiji iguanas are tetrachromatic, detecting four color channels including ultraviolet light invisible to the human eye.",
  },
  {
    title: "Conservation",
    description:
      "Listed as Endangered by the IUCN, threatened by habitat loss, introduced predators, and the exotic pet trade.",
  },
];

const STATUS_COLORS = [
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FFC107",
  "#FF9800",
  "#FF5722",
  "#F44336",
];

export default function HomeScreen() {
  const opacity = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const bgScale = useRef(new Animated.Value(1)).current;
  const fgScale = useRef(new Animated.Value(1)).current;
  const fgTranslateX = useRef(new Animated.Value(0)).current;
  const fgTranslateY = useRef(new Animated.Value(0)).current;
  const iguanaScale = useRef(new Animated.Value(1)).current;
  const iguanaTranslateX = useRef(new Animated.Value(0)).current;
  const iguanaTranslateY = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const panelOpacity = useRef(new Animated.Value(0)).current;
  const [isExpanded, setIsExpanded] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const router = useRouter();
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      router.replace("/IslandView");
    }, IDLE_TIMEOUT_MS);
  }, [router]);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      resetIdleTimer();
      return () => {
        if (idleTimer.current) clearTimeout(idleTimer.current);
      };
    }, [resetIdleTimer]),
  );

  useEffect(() => {
    ``;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.03,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseLoop.current = loop;
    loop.start();
    return () => loop.stop();
  }, []);

  const expand = () => {
    if (isExpanded) return;
    setIsExpanded(true);
    pulseLoop.current?.stop();
    Animated.parallel([
      Animated.spring(bgScale, {
        toValue: 1.4,
        friction: 8,
        tension: 25,
        useNativeDriver: true,
      }),
      Animated.spring(fgScale, {
        toValue: 1.25,
        friction: 8,
        tension: 25,
        useNativeDriver: true,
      }),
      Animated.spring(fgTranslateX, {
        toValue: -40, // negative = left, positive = right
        friction: 8,
        tension: 25,
        useNativeDriver: true,
      }),
      Animated.spring(fgTranslateY, {
        toValue: 180, // negative = up, positive = down
        friction: 8,
        tension: 25,
        useNativeDriver: true,
      }),
      Animated.spring(iguanaScale, {
        toValue: 1.25,
        friction: 7,
        tension: 35,
        useNativeDriver: true,
      }),
      Animated.spring(iguanaTranslateX, {
        toValue: -20,
        friction: 7,
        tension: 30,
        useNativeDriver: true,
      }),
      Animated.spring(iguanaTranslateY, {
        toValue: 180,
        friction: 7,
        tension: 30,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0.6,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.timing(panelOpacity, {
        toValue: 1,
        duration: 380,
        delay: 160,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableWithoutFeedback onPress={expand}>
      <Animated.View
        style={[styles.container, { opacity }]}
        onTouchStart={resetIdleTimer}
      >
        {/* Background — scaled independently for zoom effect */}
        <Animated.Image
          source={background}
          style={[styles.bgImage, { transform: [{ scale: bgScale }] }]}
          resizeMode="cover"
        />

        {/* Dark overlay — sits above background, below iguana */}
        <Animated.View
          style={[styles.overlay, { opacity: overlayOpacity }]}
          pointerEvents="none"
        />

        {/* Foreground vegetation — zooms in with background */}
        <Animated.View
          style={[
            styles.foregroundWrapper,
            {
              transform: [
                { scale: fgScale },
                { translateX: fgTranslateX },
                { translateY: fgTranslateY },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <Image
            source={foreground}
            style={styles.foreground}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Iguana — animated zoom on tap */}
        <Animated.Image
          source={iguana}
          style={[
            styles.iguana,
            {
              transform: [
                { scale: iguanaScale },
                { translateX: iguanaTranslateX },
                { translateY: iguanaTranslateY },
              ],
            },
          ]}
          resizeMode="contain"
        />

        {/* Initial state: name header + CTA button */}
        {!isExpanded && (
          <>
            <View style={styles.header}>
              <Text style={styles.commonName}>FIJI BANDED IGUANA</Text>
              <Text style={styles.scientificName}>Brachylophus bulabula</Text>
            </View>
            <Animated.View
              style={[styles.ctaWrapper, { transform: [{ scale: pulse }] }]}
            >
              <ExploreButton
                label="TAP TO EXPLORE AS A CONSERVATION RESEARCHER"
                onPress={expand}
              />
            </Animated.View>
          </>
        )}

        {/* Expanded info panel */}
        <Animated.View
          style={[styles.infoPanel, { opacity: panelOpacity }]}
          pointerEvents={isExpanded ? "box-none" : "none"}
        >
          {/* Station badge */}
          <View style={styles.stationBadge}>
            <FontAwesome5 name="broadcast-tower" size={11} color="#444" />
            <Text style={styles.stationText}>
              Welcome to the Research Station
            </Text>
          </View>

          <Text style={styles.animalName}>FIJI BANDED IGUANA</Text>
          <Text style={styles.scientificNameExpanded}>
            Brachylophus bulabula
          </Text>

          {/* Conservation status bar */}
          <View style={styles.conservationBlock}>
            <Text style={styles.conservationLabel}>Conservation Status</Text>
            <View style={styles.statusBarWrapper}>
              {STATUS_COLORS.map((color, i) => (
                <View
                  key={i}
                  style={[
                    styles.statusSegment,
                    { backgroundColor: color },
                    i === 0 && styles.segmentLeft,
                    i === STATUS_COLORS.length - 1 && styles.segmentRight,
                  ]}
                />
              ))}
              <View style={styles.statusMarker} />
            </View>
            <Text style={styles.endangeredLabel}>Endangered</Text>
          </View>

          {/* Research notes card with arrow navigation */}
          <View style={styles.cardRow}>
            <TouchableOpacity
              onPress={() => {
                setCardIndex((i) => Math.max(0, i - 1));
                resetIdleTimer();
              }}
              style={styles.arrowBtn}
              disabled={cardIndex === 0}
            >
              <FontAwesome5
                name="chevron-left"
                size={16}
                color={cardIndex === 0 ? "#ffffff44" : "#fff"}
              />
            </TouchableOpacity>

            <View style={styles.researchCard}>
              <View style={styles.cardHeader}>
                <FontAwesome5 name="clipboard" size={11} color="#999" />
                <Text style={styles.cardHeaderText}>RESEARCH NOTES</Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardTextCol}>
                  <Text style={styles.cardTitle}>
                    {RESEARCH_CARDS[cardIndex].title}
                  </Text>
                  <Text style={styles.cardDesc}>
                    {RESEARCH_CARDS[cardIndex].description}
                  </Text>
                </View>
                <Image
                  source={iguana}
                  style={styles.cardThumb}
                  resizeMode="contain"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                setCardIndex((i) => Math.min(RESEARCH_CARDS.length - 1, i + 1));
                resetIdleTimer();
              }}
              style={styles.arrowBtn}
              disabled={cardIndex === RESEARCH_CARDS.length - 1}
            >
              <FontAwesome5
                name="chevron-right"
                size={16}
                color={
                  cardIndex === RESEARCH_CARDS.length - 1 ? "#ffffff44" : "#fff"
                }
              />
            </TouchableOpacity>
          </View>

          {/* Pagination dots + count */}
          <View style={styles.pagination}>
            {RESEARCH_CARDS.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === cardIndex && styles.dotActive]}
              />
            ))}
            <Text style={styles.pageNum}>
              {cardIndex + 1}/{RESEARCH_CARDS.length}
            </Text>
          </View>

          {/* Action buttons */}
          <View style={styles.buttonsWrapper}>
            <ActionButton
              label="Begin x-ray checkup"
              color="yellow"
              onPress={() => {
                resetIdleTimer();
                router.push("/IguanaXRayScreen");
              }}
            />
            <ActionButton
              label="Explore iguana eyesight"
              color="orange"
              onPress={() => {
                resetIdleTimer();
                router.push("/AnimalVisionScreen");
              }}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    zIndex: 1,
  },
  foregroundWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 2,
  },
  foreground: {
    width: "100%",
    height: "100%",
  },
  iguana: {
    position: "absolute",
    bottom: "32%",
    right: 0,
    width: "72%",
    height: "58%",
    zIndex: 3,
  },
  // Initial state
  header: {
    alignItems: "center",
    position: "absolute",
    top: "6%",
    width: "100%",
    zIndex: 5,
  },
  commonName: {
    fontFamily: "NeueFrutigerWorld-Black",
    fontSize: 28,
    color: Colors.darkGreen,
    textAlign: "center",
    letterSpacing: 1,
  },
  scientificName: {
    fontFamily: "NeueFrutigerWorld-Regular",
    fontSize: 16,
    color: Colors.darkGreen,
    marginTop: 3,
    textAlign: "center",
  },
  ctaWrapper: {
    position: "absolute",
    bottom: "12%",
    left: 24,
    right: 24,
    zIndex: 5,
  },
  // Expanded panel
  infoPanel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: "7%",
    paddingHorizontal: 12,
    zIndex: 10,
    alignItems: "center",
  },
  stationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 6,
  },
  stationText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  animalName: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginTop: 8,
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  scientificNameExpanded: {
    fontSize: 15,
    fontStyle: "italic",
    color: "#ddd",
    fontWeight: "600",
    marginTop: 1,
  },
  conservationBlock: {
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 2,
  },
  conservationLabel: {
    fontSize: 11,
    color: "#ccc",
    marginBottom: 5,
    letterSpacing: 0.4,
  },
  statusBarWrapper: {
    flexDirection: "row",
    height: 10,
    width: "100%",
    position: "relative",
  },
  statusSegment: {
    flex: 1,
    height: 10,
  },
  segmentLeft: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  segmentRight: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  // Marker sits at ~61% (the "Endangered" position on the IUCN scale)
  statusMarker: {
    position: "absolute",
    left: "61%",
    top: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#555",
    transform: [{ translateX: -9 }],
  },
  endangeredLabel: {
    fontSize: 10,
    color: "#ddd",
    marginTop: 3,
    alignSelf: "flex-start",
    marginLeft: "57%",
  },
  // Card carousel
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 12,
    gap: 2,
  },
  arrowBtn: {
    width: 30,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  researchCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 6,
  },
  cardHeaderText: {
    fontSize: 10,
    color: "#aaa",
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  cardBody: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  cardTextCol: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 13,
    color: "#555",
    lineHeight: 19,
  },
  cardThumb: {
    width: 78,
    height: 78,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  pageNum: {
    fontSize: 11,
    color: "#ddd",
    marginLeft: 4,
  },
  // Buttons
  buttonsWrapper: {
    position: "absolute",
    bottom: "10%",
    right: 12,
    gap: 7,
  },
});
