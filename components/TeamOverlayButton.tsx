import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { BodyText, SubHeading1, SubHeading2 } from "@/components/Typography";
import { Colors } from "@/constants/theme";

const TEAM_NAMES = [
  "Interactive Zoo Screens Team",
];

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

            <SubHeading2 style={styles.eyebrow}>Credits</SubHeading2>
            <SubHeading1 style={styles.title}>Thanks to our team</SubHeading1>
            <BodyText style={styles.message}>
              This interactive Fiji banded iguana experience was created with
              care by:
            </BodyText>

            <View style={styles.nameList}>
              {TEAM_NAMES.map((name) => (
                <BodyText key={name} style={styles.name}>
                  {name}
                </BodyText>
              ))}
            </View>
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
    backgroundColor: Colors.yellow,
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
    maxWidth: 430,
    borderRadius: 8,
    backgroundColor: Colors.cream,
    padding: 26,
  },
  closeButton: {
    position: "absolute",
    right: 14,
    top: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(103,139,61,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  eyebrow: {
    fontSize: 18,
    color: Colors.green,
  },
  title: {
    marginTop: 6,
    fontSize: 34,
    color: Colors.darkGreen,
  },
  message: {
    marginTop: 14,
    fontSize: 18,
    lineHeight: 25,
    color: Colors.green,
  },
  nameList: {
    marginTop: 18,
    gap: 8,
  },
  name: {
    fontSize: 20,
    color: Colors.darkGreen,
  },
});
