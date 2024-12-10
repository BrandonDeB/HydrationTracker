import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function StartPage() {
    const router = useRouter();

    return (
        <ImageBackground
            source={require('../../assets/drawings/swamp2.png')} 
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.heading}>Welcome to the Frog Game!</Text>
                <Image
                    source={require('../../assets/drawings/frog1.png')} 
                    style={styles.frogImage}
                />
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
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    heading: {
        fontSize: 32,
        fontFamily: 'Jua',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 50, 
    },
    frogImage: {
        width: 200, 
        height: 200, 
        marginBottom: 50, 
    },
    button: {
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
