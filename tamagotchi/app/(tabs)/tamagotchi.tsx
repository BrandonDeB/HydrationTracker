import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import HydrationBar from "@/components/HydrationBar";
import { ThemedView } from "@/components/ThemedView";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from "expo-router";
import * as SQLite from "expo-sqlite";

export default function Tamagotchi() {
    type FrogColor = "green" | "blue" | "red";

    const [selectedColor, setSelectedColor] = useState<FrogColor>("green");


    const frogImage: { [key in FrogColor]: any } = {
        green: require('@/drawings/frog1.jpg'),
        blue: require('@/drawings/frog2.jpg'),
        red: require('@/drawings/frog3.jpg'),
    };

    // Function to handle color change
    const handleColorChange = (color: FrogColor) => {
        setSelectedColor(color);
    };

    return (
        <ThemedView style={{ flex: 1 }}>
            <ThemedView style={styles.topBar}>
                <MaterialCommunityIcons name="hat-fedora" size={32} color="black"  />
                <HydrationBar />
                <TouchableOpacity onPress={() => { router.push("/newUser"); }}>
                <MaterialCommunityIcons name="cog" size={32} color="black" />
                </TouchableOpacity>
            </ThemedView>

            <View style={styles.container}>
                <Text>Choose Your Frog Color</Text>

                {/* Buttons to select frog color */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={() => handleColorChange("green")}>
                        <Text style={styles.button}>Green</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleColorChange("blue")}>
                        <Text style={styles.button}>Blue</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleColorChange("red")}>
                        <Text style={styles.button}>red</Text>
                    </TouchableOpacity>
                </View>

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
        flexDirection: "row",
        alignSelf: "center",
        margin: 50,
        padding: 10,
        justifyContent: "space-between",
        backgroundColor: "rgba(76, 175, 80, 0.0)",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
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
    },
    frogImage: {
        width: 200,
        height: 200,
    },
});
