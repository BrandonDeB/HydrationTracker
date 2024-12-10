import { NavigationContainer } from '@react-navigation/native';
import { Slot } from 'expo-router';

export default function App() {
    return (
        <NavigationContainer>
            <Slot /> {/* Expo Router handles rendering child pages */}
        </NavigationContainer>
    );
}
