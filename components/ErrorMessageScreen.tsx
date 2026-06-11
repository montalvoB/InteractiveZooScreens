import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { router } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { BodyText, SubHeading1, SubHeading2 } from "@/components/Typography";
import { Colors } from "@/constants/theme";

const iguana = require("../assets/images/elements/Iguana.png");

type ErrorMessageScreenProps = {
  onRetry?: () => void;
};

export default function ErrorMessageScreen({ onRetry }: ErrorMessageScreenProps) {
  return (
    <View style={styles.container}>
      <Image source={iguana} resizeMode="contain" style={styles.iguana} />
      <View style={styles.card}>
        <SubHeading2 style={styles.eyebrow}>Uh oh</SubHeading2>
        <SubHeading1 style={styles.title}>Under maintenance</SubHeading1>
        <BodyText style={styles.body}>
          Something happened on this screen. Please try again in a moment.
        </BodyText>
        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.84}
            onPress={onRetry ?? (() => router.replace("/"))}
            style={styles.primaryButton}
          >
            <FontAwesome5 name="redo" size={14} color={Colors.darkGreen} />
            <BodyText style={styles.primaryText}>Try again</BodyText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.84}
            onPress={() => router.replace("/")}
            style={styles.secondaryButton}
          >
            <BodyText style={styles.secondaryText}>Go home</BodyText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  iguana: {
    width: "82%",
    height: 230,
    marginBottom: -22,
  },
  card: {
    width: "100%",
    maxWidth: 460,
    borderRadius: 8,
    backgroundColor: Colors.white,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  eyebrow: {
    fontSize: 20,
    color: Colors.green,
  },
  title: {
    marginTop: 4,
    fontSize: 38,
    textAlign: "center",
    color: Colors.darkGreen,
  },
  body: {
    marginTop: 12,
    fontSize: 18,
    lineHeight: 25,
    textAlign: "center",
    color: Colors.green,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  primaryButton: {
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: Colors.yellow,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  primaryText: {
    fontFamily: "NeueFrutigerWorld-Bold",
    fontSize: 15,
    color: Colors.darkGreen,
  },
  secondaryButton: {
    minHeight: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.green,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    fontFamily: "NeueFrutigerWorld-Bold",
    fontSize: 15,
    color: Colors.darkGreen,
  },
});
