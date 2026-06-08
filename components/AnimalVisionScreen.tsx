import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AnimalVisionScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/backgrounds/animal-vision.jpg")}
        style={styles.backgroundImage}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.menuPanel}>
        <View style={styles.menuSection}>
          <View style={styles.modeRow}>
            <Text style={styles.menuLabel}>Mode</Text>
            <TouchableOpacity style={styles.modeButton} onPress={() => {}}>
              <Text style={styles.modeButtonText}>Fiji Banded Iguana Vision</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modeButton} onPress={() => {}}>
              <Text style={styles.modeButtonText}>Human Vision</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuSection}>
          <Text style={styles.menuLabel}>Fiji Banded Iguana Vision</Text>
          <Text style={styles.description}>
            Fiji iguanas are tetrachromatic, they see four color channels
            including UV light that's totally invisible to the human eye. They
            have an all-cone retina which provides incredible color detail in
            daylight but renders them nearly blind at night.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuSection}>
          <Text style={styles.menuLabel}>Interested in Learning More?</Text>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi maxime
            magni dolor veritatis fugit in nam, iste dolores, repudiandae numquam
            asperiores rem dolore, iusto nemo! Aliquid debitis quisquam culpa
            perspiciatis!
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  menuPanel: {
    flexDirection: "column",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: Colors.cream,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 10,
  },
  menuSection: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuLabel: {
    fontFamily: "NeueFrutigerWorld-Bold",
    fontSize: 16,
    color: Colors.darkGreen,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.green,
    marginHorizontal: 16,
    opacity: 0.25,
  },
  description: {
    fontFamily: "NationalPark-Regular",
    fontSize: 14,
    color: Colors.green,
    lineHeight: 20,
    marginTop: 6,
  },
  modeButton: {
    borderWidth: 1,
    borderColor: Colors.green,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  modeButtonText: {
    fontFamily: "NeueFrutigerWorld-Regular",
    fontSize: 13,
    color: Colors.darkGreen,
  },
  modeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    position: "absolute",
    top: 54,
    left: 18,
    zIndex: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  backButtonText: {
    fontFamily: "NeueFrutigerWorld-Bold",
    color: Colors.cream,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});