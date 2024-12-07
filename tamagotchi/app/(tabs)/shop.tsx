import {Dimensions, Image, ScrollView, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from "react";
import {ThemedView} from "@/components/ThemedView";
import {Text} from "react-native-ui-lib";
import * as SQLite from "expo-sqlite";
import HatCard from "@/components/HatCard";
import { Audio } from 'expo-av';
import {Sound} from "expo-av/build/Audio/Sound";
import {LinearGradient} from "expo-linear-gradient";
import {useFocusEffect} from "expo-router";
import {HatPurchaseModal} from "@/components/HatPurchaseModal";

interface Hat {hatId: number, price: number, name: string, filePath: string, purchased: boolean}

export default function Shop() {

    const [hats, setHats] = useState<Hat[]>([]);
    const [gold, setGold] = useState(0);
    const [audioSound, setSound] = useState<Sound>();
    const [hatPurchaseVisible, setHatPurchaseVisible] = useState(false);
    const [selectedHat, setSelectedHat] = useState<any>({hatId: 1, price: 100, name: "Missingno", filePath: "hat1.png", purchased: false});

    const images = require.context('../../assets/drawings', true);
    const windowHeight = Dimensions.get('window').height;

    async function hatPress(hatId: number) {
        console.log("hat", hatId);
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const hat= await db.getFirstAsync('SELECT * FROM hats where hatId = ?',[hatId]);
        setSelectedHat(hat);
        setHatPurchaseVisible(true);
    }

    async function loadHats() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const hats: any = await db.getAllAsync('SELECT * FROM hats WHERE purchased = 0').catch(function () {
            console.log("Hats Promise Rejected");
        });
        console.log(hats);
        setHats(hats);
    }

    async function loadCoins() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const coins: { coins: number } | null = await db.getFirstAsync('SELECT coins FROM user');
        console.log(coins);
        if (coins?.coins) {
            console.log(coins.coins);
            setGold(coins.coins);
        }
    }

    const closeModal = () => {
        setHatPurchaseVisible(false);
    }

    async function handlePurchase(hat: Hat) {
        if (gold >= hat.price) {
            try {
                const db = await SQLite.openDatabaseAsync('hydration.db');

                const newGold = gold - hat.price;
                await db.runAsync(
                    `UPDATE user SET coins = ?`,
                    [newGold]
                );

                console.log(`Successfully purchased ${hat.name}. Remaining coins: ${newGold}`);
                setGold(newGold);

                await db.runAsync(
                    `UPDATE hats SET purchased = 1 WHERE hatId = ?`,
                    [hat.hatId]
                );

                console.log(`${hat.name} marked as purchased.`);
            } catch (error) {
                console.error("Failed to complete purchase:", error);
            }
        } else {
            console.log("Not enough gold to purchase this hat.");
        }
        loadCoins();
        loadHats();
        setHatPurchaseVisible(false);
    }

    useFocusEffect(
        useCallback(() => {
            let sound: Sound | undefined;

            const initialize = async () => {
                await loadHats();
                await loadCoins();
                console.log('Loading Sound');
                const { sound: loadedSound } = await Audio.Sound.createAsync(
                    require('../../assets/SHOP_THEME.mp3')
                );
                sound = loadedSound;
                setSound(sound);
                console.log('Playing Sound');
                await sound.playAsync();
            };

            initialize();

            return () => {
                if (sound) {
                    console.log('Unloading Sounds');
                    sound.stopAsync();
                    sound.unloadAsync();
                }
            };
        }, [])
    );

    return (
        <>
        <ScrollView style={styles.scroll}>
            <View style={styles.header}>
                <Image style={styles.image} source={require('../../assets/drawings/frog1.png')} />
                <Text style={styles.headerText}>Would you like something today?</Text>
            </View>
            <View style={[styles.shopPanel, {height: windowHeight*1.1}]}>
                <View style={styles.price}>
                    <Text style={styles.priceText}>{"You Own: " + gold}</Text>
                    <Image style={styles.gold} source={images('./gold.png')} />
                </View>
                <View style={styles.hatGrid}>
                {
                    hats.map((hat: Hat) => (
                        <HatCard id={hat.hatId} price={hat.price} name={hat.name} key={hat.hatId} image={hat.filePath} purchased={hat.purchased} onPress={hatPress} />
                    ))
                }
                </View>
            </View>
        </ScrollView>
        <HatPurchaseModal isVisible={hatPurchaseVisible} hat={selectedHat} onClose={closeModal} onSelect={handlePurchase} />
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        marginVertical: 80, // Slightly adjusted for a compact feel
    },
    scroll: {
        backgroundColor: "#5FC1FF"
    },
    shopPanel: {
        borderRadius: 25,
        backgroundColor: "#fff",
    },
    headerText: {
        fontSize: 32,
        color: '#fff', // A bright pink reminiscent of 90s toy colors
        fontFamily: 'Jua',
        textAlign: 'center',
        textShadowColor: '#000',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
    },
    hatGrid: {
        padding: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        transform: 'scaleX(-1)',
        position: "absolute",
        left: 25
    },
    background: {
        height: "100%",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
    },
    priceText: {
        top: 5,
        fontSize: 28,
        fontFamily: 'Jua',
    },
    gold: {
        top: 2,
        height: 30,
        width: 30,
        resizeMode: "contain",
    },
    price: {
        flexDirection: "row",
        justifyContent: "center",
        margin: 10,
        gap: 3
    },
});