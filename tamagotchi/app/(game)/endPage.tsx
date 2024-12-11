import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import * as SQLite from "expo-sqlite";

export default function EndPage() {
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
                {/* Coin Earnings Section */}
                <View style={styles.earnedContainer}>
                    <Text style={styles.earnedText}>You earned 100 coins</Text>
                    <Image
                        source={require('../../assets/drawings/gold.png')}
                        style={styles.coinImage}
                    />
                </View>

                {/* Frog and Text Bubble */}
                <View style={styles.frogContainer}>
                    {/* Text Bubble */}
                    <View style={styles.textBubbleContainer}>
                        <Image
                            source={require('../../assets/drawings/textBubble.png')}
                            style={[styles.textBubble, styles.flippedBubble]}
                        />
                        <Text style={styles.textBubbleText}>Game Over!</Text>
                    </View>

                    {/* Frog Image */}
                    <Image
                        source={frogImages[selectedColor]}
                        style={styles.frogImage}
                    />
                </View>

                {/* Back Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/tamagotchi')}
                >
                    <Text style={styles.buttonText}>Back to Tamagotchi</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

export const options = {
    headerShown: false,
};

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
    earnedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 250, // Adjust positioning
        marginBottom: 30, // Space below the earnings text
    },
    earnedText: {
        fontSize: 30,
        fontFamily: 'Jua',
        fontWeight: 'bold',
        color: 'white',
        marginRight: 10,
    },
    coinImage: {
        width: 40,
        height: 40,
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
        lineHeight: 22,
        flexWrap: 'wrap',
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
