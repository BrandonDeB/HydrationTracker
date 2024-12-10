import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ImageBackground,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window'); // Screen height

export default function GamePage() {
    const router = useRouter();
    const [frogPosition] = useState(new Animated.Value(height - 200)); // Initial position at the bottom of the screen
    const [frogY, setFrogY] = useState(height - 200); // State to track frog's current position

    // Use addListener to update the frogY position
    useEffect(() => {
        const listenerId = frogPosition.addListener(({ value }) => {
            setFrogY(value); // Update frogY whenever the animation updates
        });

        return () => {
            frogPosition.removeListener(listenerId); // Clean up the listener
        };
    }, [frogPosition]);

    // Function to move the frog upward
    const handleTap = () => {
        const newTargetPosition = Math.max(frogY - 150, 100); // Move 150 pixels upward or stop at 100

        Animated.timing(frogPosition, {
            toValue: newTargetPosition, // New target position
            duration: 500, // Duration of the animation (you can also adjust this)
            useNativeDriver: false, // Position animations must disable useNativeDriver
        }).start(() => {
            // Check for collision with the coin after animation completes
            checkCollision();
        });
    };


    // Check collision between frog and coin
    const checkCollision = () => {
        if (frogY <= 120) {
            // End game if the frog reaches the coin
            router.push('/endPage');
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/drawings/gameBG.jpg')} 
            style={styles.background}
        >
            <TouchableWithoutFeedback onPress={handleTap}>
                <View style={styles.container}>
                    <Text style={styles.heading}>Game Time!</Text>

                    {/* Coin at the top of the screen */}
                    <Image
                        source={require('../../assets/drawings/gold.png')} 
                        style={styles.coin}
                    />

                    {/* Frog controlled by animation */}
                    <Animated.Image
                        source={require('../../assets/drawings/frog1.png')} 
                        style={[styles.frogImage, { top: frogPosition }]}
                    />
                </View>
            </TouchableWithoutFeedback>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 32,
        fontWeight: 'bold',
        fontFamily: 'Jua',
        marginBottom: 20,
        color: 'white',
        position: 'absolute',
        top: 20, 
    },
    coin: {
        position: 'absolute',
        top: 80, 
        width: 50,
        height: 50,
    },
    frogImage: {
        position: 'absolute',
        width: 100,
        height: 100,
    },
});
