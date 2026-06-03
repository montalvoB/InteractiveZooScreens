import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false , contentStyle: { backgroundColor: '#000' } }}>
      <Stack.Screen name="IslandView" options={{ animation: "none" }} />
      <Stack.Screen name="HomeScreen" options={{ animation: "none",  }} />
      <Stack.Screen name="index" options={{ animation: "none" }} />
      <Stack.Screen
        name="InfoCardsScreen"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="DragDropScreen"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="AnimalVisionScreen"
        options={{ animation: "slide_from_right" }}
      />
    </Stack>
  );
}
