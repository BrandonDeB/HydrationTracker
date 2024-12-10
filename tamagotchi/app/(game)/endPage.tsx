import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function EndPage() {
    const router = useRouter();

    return (
        <ImageBackground
            source={require('../../assets/drawings/swamp2.png')}
            style={styles.background}
        >
            <View style={styles.container}>
               
                <Text style={styles.heading}>Game Over!</Text>

                <Image
                    source={require('../../assets/drawings/frog1.png')}
                    style={styles.frogImage}
                />

                <View style={styles.earnedContainer}>
                    <Text style={styles.earnedText}>You earned 300 coins</Text>
                    <Image
                        source={require('../../assets/drawings/gold.png')}
                        style={styles.coinImage}
                    />
                </View>

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
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    heading: {
        fontSize: 36,
        fontWeight: 'bold',
        fontFamily: 'Jua',
        color: 'white',
        marginBottom: 30,
    },
    frogImage: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    earnedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    earnedText: {
        fontSize: 24,
        fontFamily: 'Jua',
        fontWeight: 'bold',
        color: 'white',
        marginRight: 10,
    },
    coinImage: {
        width: 40,
        height: 40,
    },
    button: {
        backgroundColor: '#5FC1FF',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5, 
    },
    buttonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Jua',
    },
});
