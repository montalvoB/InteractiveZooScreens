import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const background = require("../assets/images/backgrounds/Beach.png");
const iguana = require("../assets/images/elements/Iguana.png");
const foreground = require("../assets/images/backgrounds/BeachForeground.png");

export default function HomeScreen() {
  const opacity = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.2,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const handlePress = () => {
    router.push("/InfoCardsScreen");
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View style={[styles.container, { opacity }]}>
        <ImageBackground
          source={background}
          style={styles.background}
          resizeMode="cover"
        >
          <Image
            source={foreground}
            style={styles.foreground}
            resizeMode="contain"
          />
          <Image source={iguana} style={styles.iguana} resizeMode="contain" />
          <View style={styles.header}>
            <Text style={styles.commonName}>Fiji Banded Iguana</Text>
            <View style={styles.scientificNameBadge}>
              <Text style={styles.scientificName}>Brachylophus Bulabula</Text>
            </View>
          </View>
          <View style={styles.hint}>
            <Animated.View style={{ transform: [{ scale: pulse }] }}>
              <FontAwesome5 name="hand-point-up" size={60} color="black" />
            </Animated.View>
            <Text>Tap to learn more!</Text>
          </View>
        </ImageBackground>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  iguana: {
    position: "absolute",
    bottom: "25%",
    right: 0,
    width: "70%",
    height: "70%",
  },
  foreground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 52,
    fontWeight: "300",
    color: "#f5f5f0",
    letterSpacing: 12,
    textTransform: "uppercase",
  },
  hint: {
    top: "12%",
    fontSize: 12,
    color: "#555",
    letterSpacing: 4,
    textTransform: "uppercase",
    alignItems: "center",
    gap: 10,
  },
  header: {
    alignItems: "center",
    position: "absolute",
    top: "10%",
    width: "100%",
  },
  commonName: {
    fontSize: 32,
    fontWeight: "600",
    color: "#f5f5f0",
    textAlign: "center",
  },
  scientificNameBadge: {
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginTop: 10,
    alignSelf: "center",
    width: "50%",
  },
  scientificName: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#444",
    textAlign: "center",
  },
});
