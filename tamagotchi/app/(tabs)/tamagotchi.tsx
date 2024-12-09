import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import HydrationBar from "@/components/HydrationBar";
import { ThemedView } from "@/components/ThemedView";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from "expo-router";
import * as SQLite from "expo-sqlite";

export default function Tamagotchi() {
    type FrogColor = "green" | "blue" | "red";

    const [selectedColor, setSelectedColor] = useState<FrogColor>("green");

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


    const frogImage: { [key in FrogColor]: any } = {
        green: require('../../assets/drawings/frog1.jpg'),
        blue: require('../../assets/drawings/frog2.jpg'),
        red: require('../../assets/drawings/frog3.jpg'),
    };

    // Function to handle color change
    const handleColorChange = (color: FrogColor) => {
        setSelectedColor(color);
    };

    return (
        <ThemedView style={{ flex: 1 }}>
            <ThemedView style={styles.topBar}>
                <MaterialCommunityIcons name="hat-fedora" size={32} color="white" />
                <HydrationBar />
                <TouchableOpacity onPress={() => { router.push("/newUser"); }}>
                    <MaterialCommunityIcons name="cog" size={32} color="white" />
                </TouchableOpacity>
            </ThemedView>

            <View style={styles.container}>
                <Image source={require('..//..//assets//drawings//swamp.png')} style={styles.background} />
                <View style={styles.imageContainer}>
                    <Image
                        source={frogImage[selectedColor]}
                        style={styles.frogImage}
                        resizeMode="contain"
                    />
                </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    topBar: {
        position: "absolute",
        flexDirection: "row",
        alignSelf: "center",
        alignContent: 'center',
        margin: 50,
        padding: 10,
        justifyContent: "space-between",
        backgroundColor: "#5FC1FF",
        borderRadius: 20,
        zIndex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: 'lightblue',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: 'lightblue',
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: 'lightblue',
    },
    button: {
        fontSize: 18,
        margin: 10,
        padding: 10,
        backgroundColor: '#5FC1FF',
        borderRadius: 5,
        color: 'white',
    },
    imageContainer: {
        alignItems: 'center',
        position: 'absolute',
        zIndex: 1,
    },
    frogImage: {
        width: 200,
        height: 200,
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        resizeMode: 'cover',
    }
});
