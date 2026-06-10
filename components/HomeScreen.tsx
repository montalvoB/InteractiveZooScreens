import { ActionButton, ExploreButton } from "@/components/ui/Buttons";
import { Colors } from "@/constants/theme";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
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
const iguanaPhoto = require("../assets/images/elements/fiji-banded-iguana-photo.jpg");
const foreground = require("../assets/images/backgrounds/BeachForeground.png");
const researchNotesIcon = require("../assets/images/icons/icon-research-notes.png");

const IDLE_TIMEOUT_MS = 5_000;

const RESEARCH_CARDS = [
  {
    title: "Vibrant Coloring",
    description:
      "Male Fiji banded iguanas have bright blue bands or stripes across their green backs, and females are green with pale spots.",
    fieldNote:
      "With these vibrant stripes, it is no wonder they are called banded iguanas.",
  },
  {
    title: "Island Habitat",
    description:
      "Found exclusively in the tropical rainforests of Fiji's islands, primarily on Vanua Levu and Taveuni.",
    fieldNote:
      "Fiji's dense rainforests provide both food and shelter for these tree-dwelling iguanas.",
  },
  {
    title: "Herbivore Diet",
    description:
      "Fiji iguanas feed almost entirely on leaves, flowers, and fruits, playing an important role in seed dispersal.",
    fieldNote:
      "Their role as seed dispersers makes them a keystone species in their ecosystem.",
  },
  {
    title: "Territorial Nature",
    description:
      "Males are highly territorial and will head-bob, do push-ups, and change coloration to warn rivals and attract females.",
    fieldNote:
      "Watch for these displays near basking spots — they happen fast and are easy to miss.",
  },
  {
    title: "Egg Laying",
    description:
      "Females lay a small clutch of 3–6 eggs, incubating for around 170 days — one of the longest periods of any lizard.",
    fieldNote:
      "That 170-day incubation period is nearly six months — remarkable for a reptile this size.",
  },
  {
    title: "UV Vision",
    description:
      "Fiji iguanas are tetrachromatic, detecting four color channels including ultraviolet light invisible to the human eye.",
    fieldNote:
      "Much of their world is literally invisible to us — UV patterns likely play a role in mate selection.",
  },
  {
    title: "Conservation",
    description:
      "Listed as Endangered by the IUCN, threatened by habitat loss, introduced predators, and the exotic pet trade.",
    fieldNote:
      "Mongoose introduction has been devastating — they prey on eggs and juveniles with ease.",
  },
];

// Smooth gradient stops across the full IUCN spectrum
const GRADIENT_COLORS = [
  "#4CAF50",
  "#6EB544",
  "#8BC34A",
  "#ADCC45",
  "#CDDC39",
  "#DDD034",
  "#EEC42E",
  "#FFC107",
  "#FFB000",
  "#FF9800",
  "#FF7022",
  "#FF5722",
  "#F84836",
  "#F44336",
] as const;

const CARD_ANIM_UNIT = 1;

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
  const cardAnim = useRef(new Animated.Value(0)).current;

  const [isExpanded, setIsExpanded] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
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

  const navigateCard = (nextIndex: number) => {
    const direction = nextIndex > cardIndex ? 1 : -1;
    setCardIndex(nextIndex);
    resetIdleTimer();

    Animated.timing(cardAnim, {
      toValue: -direction * CARD_ANIM_UNIT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setDisplayIndex(nextIndex);
      cardAnim.setValue(direction * CARD_ANIM_UNIT);
      Animated.timing(cardAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const expand = () => {
    if (isExpanded) return;
    setIsExpanded(true);
    pulseLoop.current?.stop();
    Animated.parallel([
      Animated.spring(bgScale, {
        toValue: 1.2,
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
        toValue: -40,
        friction: 8,
        tension: 25,
        useNativeDriver: true,
      }),
      Animated.spring(fgTranslateY, {
        toValue: 195,
        friction: 8,
        tension: 25,
        useNativeDriver: true,
      }),
      Animated.spring(iguanaScale, {
        toValue: 1.25,
        friction: 8,
        tension: 25,
        useNativeDriver: true,
      }),
      Animated.spring(iguanaTranslateX, {
        toValue: -20,
        friction: 8,
        tension: 25,
        useNativeDriver: true,
      }),
      Animated.spring(iguanaTranslateY, {
        toValue: 195,
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

  const inputRange = [-CARD_ANIM_UNIT, 0, CARD_ANIM_UNIT];
  const cardScale = cardAnim.interpolate({
    inputRange,
    outputRange: [0.9, 1, 0.9],
    extrapolate: "clamp",
  });
  const cardTranslateX = cardAnim.interpolate({
    inputRange,
    outputRange: [-500, 0, 500],
    extrapolate: "clamp",
  });
  const cardRotate = cardAnim.interpolate({
    inputRange,
    outputRange: ["-3deg", "0deg", "3deg"],
    extrapolate: "clamp",
  });

  return (
    <TouchableWithoutFeedback onPress={expand}>
      <Animated.View
        style={[styles.container, { opacity }]}
        onTouchStart={resetIdleTimer}
      >
        {/* Background */}
        <Animated.Image
          source={background}
          style={[styles.bgImage, { transform: [{ scale: bgScale }] }]}
          resizeMode="cover"
        />

        {/* Dark overlay */}
        <Animated.View
          style={[styles.overlay, { opacity: overlayOpacity }]}
          pointerEvents="none"
        />

        {/* Foreground vegetation */}
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

        {/* Iguana */}
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

        {/* Initial state */}
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
            <FontAwesome5 name="binoculars" size={11} color={Colors.brown} />
            <Text style={styles.stationText}>
              Lizard Landing Research Station
            </Text>
          </View>

          {/* Left-aligned name + scientific name + conservation block */}
          <View style={styles.leftBlock}>
            <Text style={styles.animalName}>FIJI BANDED IGUANA</Text>
            <Text style={styles.scientificNameExpanded}>
              Brachylophus bulabula
            </Text>

            {/* Conservation status bar — compact, gradient */}
            <View style={styles.conservationBlock}>
              <Text style={styles.conservationLabel}>Conservation Status</Text>
              <View style={styles.statusBarWrapper}>
                <LinearGradient
                  colors={GRADIENT_COLORS}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientBar}
                />
                <View style={styles.statusMarker} />
              </View>
              <Text style={styles.endangeredLabel}>Endangered</Text>
            </View>
          </View>

          {/* Research notes card */}
          <View style={styles.cardRow}>
            <TouchableOpacity
              onPress={() => navigateCard(Math.max(0, cardIndex - 1))}
              style={styles.arrowBtn}
              disabled={cardIndex === 0}
            >
              <FontAwesome5
                name="chevron-left"
                size={16}
                color={cardIndex === 0 ? "#ffffff44" : Colors.cream}
              />
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.researchCard,
                {
                  transform: [
                    { scale: cardScale },
                    { translateX: cardTranslateX },
                    { rotate: cardRotate },
                  ],
                },
              ]}
            >
              {/* Card header */}
              <View style={styles.cardHeader}>
                <Image
                  source={researchNotesIcon}
                  style={styles.cardHeaderIcon}
                  resizeMode="contain"
                />
                <Text style={styles.cardHeaderText}>RESEARCH NOTES</Text>
              </View>

              {/* Body: text + photo */}
              <View style={styles.cardBody}>
                <View style={styles.cardTextCol}>
                  <Text style={styles.cardTitle}>
                    {RESEARCH_CARDS[displayIndex].title}
                  </Text>
                  <Text style={styles.cardDesc} ellipsizeMode="tail">
                    {RESEARCH_CARDS[displayIndex].description}
                  </Text>
                </View>
                <Image
                  source={iguanaPhoto}
                  style={styles.cardThumb}
                  resizeMode="cover"
                />
              </View>

              {/* Field note — full width below body */}
              <View style={styles.fieldNote}>
                <FontAwesome5 name="pen" size={8} color={Colors.darkGreen} />
                <Text style={styles.fieldNoteText}>
                  {RESEARCH_CARDS[displayIndex].fieldNote}
                </Text>
              </View>
            </Animated.View>

            <TouchableOpacity
              onPress={() =>
                navigateCard(Math.min(RESEARCH_CARDS.length - 1, cardIndex + 1))
              }
              style={styles.arrowBtn}
              disabled={cardIndex === RESEARCH_CARDS.length - 1}
            >
              <FontAwesome5
                name="chevron-right"
                size={16}
                color={
                  cardIndex === RESEARCH_CARDS.length - 1
                    ? "#ffffff44"
                    : Colors.cream
                }
              />
            </TouchableOpacity>
          </View>

          {/* Pagination dots — outside the card */}
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
    top: 60,
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
    bottom: "25%",
    right: 0,
    width: "72%",
    height: "58%",
    zIndex: 3,
  },

  // -- Initial state
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
    fontStyle: "italic",
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

  // -- Expanded panel
  infoPanel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: "7%",
    paddingHorizontal: 14,
    zIndex: 10,
    alignItems: "flex-start",
  },
  stationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cream,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 6,
    alignSelf: "flex-start",
  },
  stationText: {
    fontFamily: "NeueFrutigerWorld-Regular",
    fontSize: 12,
    color: Colors.brown,
  },

  // Left-aligned block for name + status
  leftBlock: {
    alignSelf: "stretch",
    marginTop: 8,
  },
  animalName: {
    fontFamily: "NeueFrutigerWorld-Black",
    fontSize: 32,
    color: Colors.cream,
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  scientificNameExpanded: {
    fontFamily: "NeueFrutigerWorld-Regular",
    fontSize: 14,
    fontStyle: "italic",
    color: Colors.cream,
    marginTop: 1,
  },

  // -- Conservation bar — compact
  conservationBlock: {
    marginTop: 8,
    width: "60%", // only spans part of the row so it reads as compact
  },
  conservationLabel: {
    fontFamily: "NationalPark-Regular",
    fontSize: 10,
    color: Colors.cream,
    marginBottom: 4,
    letterSpacing: 0.4,
    opacity: 0.85,
  },
  statusBarWrapper: {
    height: 8,
    width: "100%",
    position: "relative",
    borderRadius: 4,
    overflow: "hidden",
  },
  gradientBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  statusMarker: {
    position: "absolute",
    left: "61%",
    top: -3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.cream,
    borderWidth: 2,
    borderColor: Colors.brown,
    transform: [{ translateX: -7 }],
  },
  endangeredLabel: {
    fontFamily: "NationalPark-Regular",
    fontSize: 9,
    color: Colors.cream,
    marginTop: 3,
    opacity: 0.85,
    marginLeft: "57%",
  },

  // -- Research card
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 12,
    gap: 2,
    height: 240,
  },
  arrowBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(36, 68, 45, 0.78)",
  },
  researchCard: {
    flex: 1,
    backgroundColor: Colors.cream,
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
    height: 220,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: Colors.green,
    paddingBottom: 6,
  },
  cardHeaderIcon: {
    width: 30,
    height: 30,
  },
  cardHeaderText: {
    fontFamily: "NeueFrutigerWorld-Bold",
    fontSize: 10,
    color: Colors.green,
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
    fontFamily: "NeueFrutigerWorld-Black",
    fontSize: 16,
    color: Colors.darkGreen,
    marginBottom: 5,
  },
  // Slightly smaller, darker than before
  cardDesc: {
    fontFamily: "NeueFrutigerWorld-Regular",
    fontSize: 11,
    color: Colors.darkGreen,
    lineHeight: 17,
    opacity: 0.85,
  },
  cardThumb: {
    width: 78,
    height: 78,
    borderRadius: 8,
    backgroundColor: Colors.cream,
  },

  // Field note — full width below body
  fieldNote: {
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(103,139,61,0.12)",
  },
  fieldNoteText: {
    flex: 1,
    fontFamily: "NationalPark-Regular",
    fontSize: 10,
    lineHeight: 14,
    color: Colors.darkGreen,
  },

  // -- Pagination dots — outside the card
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
    alignSelf: "center",
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
    backgroundColor: Colors.cream,
  },
  pageNum: {
    fontFamily: "NationalPark-Regular",
    fontSize: 11,
    color: Colors.cream,
    marginLeft: 4,
  },

  // -- Action buttons
  buttonsWrapper: {
    position: "absolute",
    bottom: "5%",
    right: 12,
    gap: 7,
  },
});
