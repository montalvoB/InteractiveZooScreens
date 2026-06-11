import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/theme";

const teamCreditsImage = require("../assets/images/team/team-credits.png");

export default function TeamOverlayButton() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        accessibilityLabel="Open team credits"
        activeOpacity={0.85}
        onPress={() => setVisible(true)}
        style={styles.button}
      >
        <FontAwesome5 name="user-friends" size={20} color={Colors.darkGreen} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.scrim} onPress={() => setVisible(false)}>
          <Pressable style={styles.card}>
            <TouchableOpacity
              accessibilityLabel="Close team credits"
              activeOpacity={0.8}
              onPress={() => setVisible(false)}
              style={styles.closeButton}
            >
              <FontAwesome5 name="times" size={16} color={Colors.darkGreen} />
            </TouchableOpacity>

            <Image
              source={teamCreditsImage}
              style={styles.creditsImage}
              resizeMode="contain"
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 18,
    top: 54,
    zIndex: 1000,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(245, 198, 27, 0.72)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 12,
  },
  scrim: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 560,
    aspectRatio: 1.4,
    borderRadius: 28,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,244,223,0.72)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  creditsImage: {
    width: "100%",
    height: "100%",
  },
});
