import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AnimalVisionScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/backgrounds/animal-vision.jpg")}
        style={styles.backgroundImage}
      />

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
            including UV light that’s totally invisible to the human eye. They
            have an all-cone retina which provides incredible color detail in
            daylight but renders them nearly blind at night.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.menuSection}>
          <Text style={styles.menuLabel}>Interested in Learning More?</Text>
            <Text style={styles.description}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi maxime magni dolor veritatis fugit in nam, iste dolores, repudiandae numquam asperiores rem dolore, iusto nemo! Aliquid debitis quisquam culpa perspiciatis!
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
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "#fff",
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
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginTop: 6,
  },
  modeButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  modeButtonText: {
    fontSize: 13,
    color: "#222",
  },
  modeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
