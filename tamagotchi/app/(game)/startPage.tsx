import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import * as SQLite from "expo-sqlite";

export default function StartPage() {
    const router = useRouter();
    const [selectedColor, setSelectedColor] = useState<'green' | 'blue' | 'red'>('green'); // Default color

    const frogImages = {
        green: require('../../assets/drawings/frog1.png'),
        blue: require('../../assets/drawings/frog2.png'),
        red: require('../../assets/drawings/frog3.png'),
    };

    async function getFrogColor() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const color: { frogColor: "green" | "blue" | "red" } | null = await db.getFirstAsync('SELECT frogColor FROM user');
        console.log(color);
        if (color != null) {
            setSelectedColor(color.frogColor);
        }
    }

    useEffect(() => {
        getFrogColor();
    }, []);

    return (
        <ImageBackground
            source={require('../../assets/drawings/swamp2.png')}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.heading}>Welcome to the Frog Game!</Text>

                {/* Frog and Text Bubble */}
                <View style={styles.frogContainer}>
                    {/* Text Bubble */}
                    <View style={styles.textBubbleContainer}>
                        <Image
                            source={require('../../assets/drawings/textBubble.png')}
                            style={[styles.textBubble, styles.flippedBubble]}
                        />
                        <Text style={styles.textBubbleText}>
                            Tap the screen{'\n'}to jump up!
                        </Text>
                    </View>

                    {/* Frog Image */}
                    <Image
                        source={(frogImages[selectedColor])}
                        style={styles.frogImage}
                    />
                </View>

                {/* Start Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/(game)/gamePage')}
                >
                    <Text style={styles.buttonText}>Start Game</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    heading: {
        fontSize: 32,
        fontFamily: 'Jua',
        fontWeight: 'bold',
        color: 'white',
        marginTop: 180,
        textAlign: 'center',
    },
    frogContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 100,
    },
    frogImage: {
        width: 300,
        height: 300,
        marginTop: 20,
    },
    textBubbleContainer: {
        position: 'absolute',
        top: -100,
        right: 20,
        alignItems: 'center',
    },
    textBubble: {
        width: 440,
        height: 340,
        resizeMode: 'contain',
    },
    flippedBubble: {
        transform: [{ scaleX: -1 }],
    },
    textBubbleText: {
        position: 'absolute',
        top: '38%',
        left: '10%',
        right: '10%',
        fontSize: 22,
        fontFamily: 'Jua',
        color: 'black',
        textAlign: 'center',
        lineHeight: 22, // Adjust spacing between lines for readability
        flexWrap: 'wrap', // Ensure text wraps within the text bubble
    },
    button: {
        position: 'absolute',
        bottom: 50,
        backgroundColor: '#5FC1FF',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    buttonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Jua',
    },
});
