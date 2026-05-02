import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import InfoCardsScreen from './InfoCardsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Next" component={InfoCardsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
