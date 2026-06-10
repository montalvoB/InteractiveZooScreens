import { Colors, Radius, Spacing } from "@/constants/theme";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ButtonProps extends TouchableOpacityProps {
  label: string;
}

// ─── Scanner Button (green pill, uppercase, bold) ─────────────────────────────
// "TAP FOR THE SCANNER" style — light and dark variants
// Usage: <ScannerButton label="TAP FOR THE SCANNER" onPress={...} variant="light" />

interface ScannerButtonProps extends ButtonProps {
  variant?: "light" | "dark";
  iconLeft?: React.ReactNode;
}

export const ScannerButton: React.FC<ScannerButtonProps> = ({
  label,
  variant = "light",
  iconLeft,
  style,
  ...props
}) => (
  <TouchableOpacity
    style={[
      styles.scannerBtn,
      variant === "dark" ? styles.scannerDark : styles.scannerLight,
      style,
    ]}
    activeOpacity={0.75}
    {...props}
  >
    {iconLeft && <View style={styles.iconLeft}>{iconLeft}</View>}
    <Text
      style={[styles.scannerText, variant === "dark" && styles.scannerTextDark]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

// ─── Action Button
// "Begin x-ray checkup >" style
// Usage: <ActionButton label="Begin x-ray checkup" onPress={...} color="yellow" />

interface ActionButtonProps extends ButtonProps {
  color?: "yellow" | "orange";
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  color = "yellow",
  style,
  ...props
}) => (
  <TouchableOpacity
    style={[
      styles.actionBtn,
      color === "orange" ? styles.actionOrange : styles.actionYellow,
      style,
    ]}
    activeOpacity={0.75}
    {...props}
  >
    <Text
      style={[styles.actionText, color === "orange" && styles.actionTextOrange]}
    >
      {label}
    </Text>
    <FontAwesome5
      name="chevron-right"
      size={13}
      color={color === "yellow" ? Colors.darkGreen : Colors.white}
    />
  </TouchableOpacity>
);

// ─── Explore Button (wide pill, search icon, all caps) ────────────────────────
// "TAP TO EXPLORE AS A CONSERVATION RESEARCHER >" — home screen CTA
// Usage: <ExploreButton label="TAP TO EXPLORE AS A CONSERVATION RESEARCHER" onPress={...} />

export const ExploreButton: React.FC<ButtonProps> = ({
  label,
  style,
  ...props
}) => (
  <TouchableOpacity
    style={[styles.exploreBtn, style]}
    activeOpacity={0.8}
    {...props}
  >
    <View style={styles.exploreIconCircle}>
      <FontAwesome5 name="search" size={20} color={Colors.white} />
    </View>
    <Text style={styles.exploreText}>{label}</Text>
    <FontAwesome5 name="chevron-right" size={14} color={Colors.white} />
  </TouchableOpacity>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Scanner Button
  scannerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.pill,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
  },
  scannerLight: {
    backgroundColor: Colors.green,
  },
  scannerDark: {
    backgroundColor: Colors.darkGreen,
  },
  scannerText: {
    fontFamily: "NeueFrutigerWorld-Bold",
    fontSize: 14,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: Colors.white,
  },
  scannerTextDark: {
    color: Colors.white,
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },

  // Action Button
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: Radius.pill,
    paddingVertical: Spacing.sm + 1,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  actionYellow: {
    backgroundColor: Colors.yellow,
  },
  actionOrange: {
    backgroundColor: Colors.orange,
  },
  actionText: {
    fontFamily: "NeueFrutigerWorld-Bold",
    fontSize: 14,
    color: Colors.darkGreen,
  },
  actionTextOrange: {
    color: Colors.white,
  },

  // Explore Button
  exploreBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(41,96,41,0.9)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(85,198,85,0.6)",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.sm,
  },
  exploreIcon: {
    marginRight: Spacing.xs,
  },
  exploreText: {
    flex: 1,
    fontFamily: "NeueFrutigerWorld-Bold",
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: Colors.white,
  },
  exploreIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
});
