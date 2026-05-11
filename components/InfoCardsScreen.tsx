import { router } from "expo-router";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CarouselCards from "./CarouselCards";

const cards = [
  {
    title: "Early this Morning, NYC",
    subtitle: "Lorem ipsum dolor sit amet",
    image:
      "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?q=80&w=1200",
  },
  {
    title: "Animal Vision",
    subtitle: "See the world differently",
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1200",
  },
  {
    title: "Zoo Experience",
    subtitle: "Interactive learning cards",
    image:
      "https://images.unsplash.com/photo-1503919005314-30d93d07d823?q=80&w=1200",
  },
];

const background = require("../assets/images/backgrounds/Beach.png");

export default function InfoCardsScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={background}
        style={styles.background}
        resizeMode="cover"
      >
        <Text style={styles.title}>Info Cards</Text>
        <Text style={styles.heading}>Do you want to find out more?</Text>
        <CarouselCards
          cards={cards}
          onCardPress={(card) => {
            if (card.title === "Animal Vision") {
              router.push("/DragDropScreen");
            }
          }}
        />
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
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
  title: {
    fontSize: 45,
    fontWeight: "300",
    color: "#0a0a0a",
    letterSpacing: 12,
    textTransform: "uppercase",
    alignSelf: "center",
    padding: "5%",
  },
  backButton: {
    marginTop: 40,
    padding: 12,
  },
  backButtonText: {
    fontSize: 14,
    color: "#555",
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  heading: {
    fontSize: 18,
    color: "#0a0a0a",
    letterSpacing: 2,
    marginBottom: 24,
    paddingHorizontal: 34,
  },
  background: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
