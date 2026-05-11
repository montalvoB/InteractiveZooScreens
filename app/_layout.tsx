import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ animation: "slide_from_left" }} />
      <Stack.Screen
        name="InfoCardsScreen"
        options={{ animation: "slide_from_right" }}
      />
    </Stack>
  );
}
