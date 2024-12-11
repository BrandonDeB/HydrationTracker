import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import HydrationBar from "@/components/HydrationBar";
import { ThemedView } from "@/components/ThemedView";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {router, useFocusEffect} from "expo-router";
import * as SQLite from "expo-sqlite";
import {HatPurchaseModal} from "@/components/HatPurchaseModal";
import {HatSelectModal} from "@/components/HatSelectModal";
import { useRouter } from 'expo-router';


interface Hat {hatId: number, price: number, name: string, filePath: string, purchased: boolean}

export default function Tamagotchi() {
    type FrogColor = "green" | "blue" | "red";

    const [selectedColor, setSelectedColor] = useState<FrogColor>("green");
    const [todayIntake, setTodayIntake] = useState<number>(0);
    const [username, setUsername] = useState<string>("");
    const [splashText, setSplashText] = useState<string>("");
    const [hatSelectVisible, setHatSelectVisible] = useState<boolean>(false);
    const [selectedHat, setSelectedHat] = useState<number>(0);
    const sickFrogImage = require('../../assets/drawings/frog_dead.png');


    const images = require.context('../../assets/drawings', true);


    async function pullTodayInfo() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const name: { name: string } | null = await db.getFirstAsync('SELECT name FROM user');
        if (name != null) {
            setUsername(name.name);
        }
        const hydration: any = await db.getAllAsync(
            `SELECT SUM(hydration) AS total_hydration 
            FROM records
            WHERE DATE(time) = CURRENT_DATE;`).catch(function () {
            console.log("Current Hydration Promise Rejected");
        });
        if (hydration[0].total_hydration != null) {
            console.log(hydration[0].total_hydration);
            setTodayIntake(hydration[0].total_hydration);
        }
        const totalHydration = hydration?.[0]?.total_hydration || 0; // Default to 0 if no result

        setTodayIntake(totalHydration);

        if (totalHydration === 0) {
            console.log("Setting sick frog pose");
            setCurrentPose(sickFrogImage);
        } else {
            console.log("Setting random frog pose");
            setCurrentPose(getRandomPose(selectedColor));
        }

    }

    async function getFrogColor() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const color: { frogColor: "green" | "blue" | "red" } | null = await db.getFirstAsync('SELECT frogColor FROM user');
        console.log(color);
        if (color != null) {
            setSelectedColor(color.frogColor);
        }
    }



    useFocusEffect(
        useCallback(() => {
        getFrogColor();
        pullTodayInfo();
        const splashTextsLoad = [
            "Click me to play a game!",
            "Hello "+username+", remember to drink water today!",
            "You must be thirsty. You've only had "+todayIntake+" oz to drink today.",
            "Ribbit.... ribbit"
        ];
        setSplashText(splashTextsLoad[Math.floor(Math.random() * splashTextsLoad.length)]);
        console.log(splashText);
        }, [selectedColor])

    );

    const closeModal = () => {
        setHatSelectVisible(false);
    }

    const handleSelect = (hatId: number) => {
        setSelectedHat(hatId);
        setHatSelectVisible(false);
    }

    const getRandomPose = (color: FrogColor): any => {
        const poses = frogImage[color];
        return poses[Math.floor(Math.random() * poses.length)];
    };

    const frogImage: { [key in FrogColor]: any } = {
        green: [
            require('../../assets/drawings/frog1.png'),
            require('../../assets/drawings/frog1_sit.png'),
            require('../../assets/drawings/frog1_wink.png'),
            require('../../assets/drawings/frog1_water.png'),
        ],
        blue: [
            require('../../assets/drawings/frog2.png'),
            require('../../assets/drawings/frog2_sit.png'),
            require('../../assets/drawings/frog2_wink.png'),
            require('../../assets/drawings/frog2_water.png'),
        ],
        red: [
            require('../../assets/drawings/frog3.png'),
            require('../../assets/drawings/frog3_sit.png'),
            require('../../assets/drawings/frog3_wink.png'),
            require('../../assets/drawings/frog3_water.png'),
        ],
    };

    // Function to handle color change
    const handleColorChange = (color: FrogColor) => {
        setSelectedColor(color);
    };

    const [currentPose, setCurrentPose] = useState<any>(getRandomPose("green"));

    return (
        <ThemedView style={{ flex: 1 }}>
            <ThemedView style={styles.topBar}>
                <TouchableOpacity onPress={() => { setHatSelectVisible(true) }}>
                    <MaterialCommunityIcons name="hat-fedora" size={32} color="white" />
                </TouchableOpacity>
                <HydrationBar />
                <TouchableOpacity onPress={() => { router.push("/newUser"); }}>
                    <MaterialCommunityIcons name="cog" size={32} color="white" />
                </TouchableOpacity>
            </ThemedView>

            <View style={styles.container}>
                <Image source={require('../../assets/drawings/swamp.png')} style={styles.background} />
                <Image source={require('../../assets/drawings/textBubble.png')} style={styles.textBubble} />
                {selectedHat ? <Image source={images('./hat'+selectedHat+'.png')} style={styles.hat} /> : <></>}
                <View style={styles.bubble}><Text style={styles.splashText}>{splashText}</Text></View>
                <TouchableOpacity onPress={() => router.replace('/(game)/startPage')}>
                    <Image
                        source={currentPose}
                        style={styles.frogImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
            <HatSelectModal isVisible={hatSelectVisible} onClose={closeModal} onSelect={handleSelect} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    hat: {
        height: 250,
        width: 250,
        position: 'absolute',
        left: "30%",
        top: "35%"
    },
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
    bubble: {
        height: "50%",
        width: "55%",
        position: "absolute",
        top: 200,
        left: "9%"
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
    splashText: {
        position: 'absolute',
        fontSize: 24,
        fontFamily: "Jua"
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
        top: 60,
        width: 400,
        height: 400,
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
    },
    textBubble: {
        position: 'absolute',
        top: 70,
        left: 0,
        right: 0,
        bottom: 0,
        width: '70%',
        height: '50%',
        transform: "scaleX(-1)",
        zIndex: 0,
        resizeMode: 'cover',
    }
});
