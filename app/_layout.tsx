import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Prevent the native splash screen from auto-hiding before assets load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 1. Register and map local font asset pathways
  const [loaded, error] = useFonts({
    "NeueFrutigerWorld-Black": require("../assets/fonts/NeueFrutigerWorld-Black.otf"),
    "NeueFrutigerWorld-Bold": require("../assets/fonts/NeueFrutigerWorld-Bold.otf"),
    "NeueFrutigerWorld-Regular": require("../assets/fonts/NeueFrutigerWorld-Regular.otf"),
    "NationalPark-Regular": require("../assets/fonts/NationalPark-VariableVF.ttf"),
  });

  // 2. Hide the splash screen once fonts are fully loaded into memory
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // 3. Render nothing while waiting for loading to complete
  if (!loaded && !error) {
    return null;
  }

  // 4. Mount your actual UI stacks securely with fonts ready to use
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000" },
      }}
    >
      <Stack.Screen name="IslandView" options={{ animation: "none" }} />
      <Stack.Screen name="HomeScreen" options={{ animation: "none" }} />
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
        name="IguanaXRayScreen"
        options={{ animation: "slide_from_right" }}
      />
        <Stack.Screen
          name="AnimalVisionScreen"
          options={{ animation: "slide_from_right" }}
        />
    </Stack>
  );
}