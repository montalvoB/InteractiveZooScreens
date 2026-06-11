import { router } from "expo-router";
import {
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import CarouselCards from "./CarouselCards";
import { BodyText, DisplayHeading, SubHeading1 } from "@/components/Typography";

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
  {
    title: "X-Ray Vision",
    subtitle: "Scan the iguana to see inside",
    image:
      "https://plus.unsplash.com/premium_vector-1731349578021-89791dc2989b?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
        <DisplayHeading style={styles.title}>Info Cards</DisplayHeading>
        <BodyText style={styles.heading}>Do you want to find out more?</BodyText>
        <CarouselCards
          cards={cards}
          onCardPress={(card) => {
            if (card.title === "Animal Vision") {
              router.push("/DragDropScreen");
            } else if (card.title === "X-Ray Vision") {
              router.push("/IguanaXRayScreen");
            }
          }}
        />
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={styles.backButton}
        >
          <SubHeading1 style={styles.backButtonText}>← Back</SubHeading1>
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
