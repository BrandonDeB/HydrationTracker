import React, { useState, useEffect } from 'react';
import {Button, View, StyleSheet, Modal, Pressable, TouchableOpacity} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { router } from 'expo-router';
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import AddBottle from "@/app/addBottle";
import CustomAmount from "@/app/customAmount";
import AntDesign from "@expo/vector-icons/AntDesign";
import {Audio} from "expo-av";

export default function HomeScreen() {
    const [waterIntake, setWaterIntake] = useState(0);
    const [waterBottles, setWaterBottles] = useState<any[]>([]);
    const [steps, setSteps] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [customModalVisible, setCustomModalVisible] = useState(false);

    async function pullBottles() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const allBottles: any = await db.getAllAsync('SELECT * FROM bottles').catch(function () {
            console.log("All Bottles Promise Rejected");
        });
        setWaterBottles(allBottles);
    }

    async function pullHydration() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const hydration: any = await db.getAllAsync(
            `SELECT SUM(hydration) AS total_hydration 
            FROM records
            WHERE DATE(time) = CURRENT_DATE;`).catch(function () {
            console.log("Current Hydration Promise Rejected");
        });
        console.log(hydration);
        if (hydration[0].total_hydration != null) {
            setWaterIntake(hydration[0].total_hydration);
        }
    }

    async function drinkBottle(size: number) {
        setWaterIntake(waterIntake + size);
        const db = await SQLite.openDatabaseAsync('hydration.db');
        await db.runAsync(
            `INSERT INTO records (steps, hydration) VALUES (?, ?);`,
            [steps, size]
        ).catch(() => {
            console.log("Bottle Add Promise Rejected");
        });
        const { sound: loadedSound } = await Audio.Sound.createAsync(
            require('../../assets/get-comfy.mp3')
        );
        await loadedSound.playAsync();
    }

    async function addNewBottle(size: number) {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        try {
            await db.runAsync(`INSERT INTO bottles (size) VALUES (?);`, [size]);
            await pullBottles();
        } catch (error) {
            console.error("Failed to add bottle:", error);
        }
    }

    function handleDataUpdated() {
        pullHydration();
    }

    async function removeBottle(size: number) {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        try {
            await db.runAsync(`DELETE FROM bottles WHERE size=?;`, [size]);
            await pullBottles();
        } catch (error) {
            console.error("Failed to remove bottle:", error);
        }
    }


    useEffect(() => {
        async function setup() {
            const db = await SQLite.openDatabaseAsync('hydration.db');
            if (await migrateDbIfNeeded() == null) {
                router.push('/newUser');
            }
            await pullBottles();
            await pullHydration();

             // db.execSync('DROP TABLE user');
             // db.execSync('DROP TABLE records');
             // db.execSync('DROP TABLE bottles');
             // db.execSync('DROP TABLE hats');
        }
        setup();
    }, []);

    return (
        <>
            <ThemedView style={styles.content}>
                <ThemedText style={styles.text}>Today's Total Intake</ThemedText>
                <ThemedText style={styles.intake}>{waterIntake} oz</ThemedText>
                <ThemedText style={styles.saved}>Saved Water Bottles</ThemedText>
                {waterBottles.map((bottle, index) => (
                    <ThemedView style={styles.bottleContainer} key={index}>
                        <TouchableOpacity onPress={() => removeBottle(bottle.size)} >
                            <AntDesign name={'delete'} size= {28} color={'black'}></AntDesign>
                        </TouchableOpacity>
                        <ThemedText style={styles.bottleAmount}>{bottle.size} oz</ThemedText>
                        <TouchableOpacity onPress={() => drinkBottle(bottle.size)} >
                            <AntDesign name={'plus'}  size={32} color="white" />
                        </TouchableOpacity>
                    </ThemedView>
                ))}
                <ThemedView style={styles.buttons}>
                    <Button color="#5FC1FF" title="Add Custom Amount" onPress={() => setCustomModalVisible(true)} />
                    <Button color="#5FC1FF" title="Add New Bottle" onPress={() => setModalVisible(true)} />
                </ThemedView>
            </ThemedView>

            <AddBottle
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={(size) => addNewBottle(size)}
            />

            <CustomAmount
                visible={customModalVisible}
                onClose={() => setCustomModalVisible(false)}
                onDataUpdated={handleDataUpdated}
            />

        </>
    );
}

async function migrateDbIfNeeded() {
    const hat_names = ["Cowboy Hat", "Afro", "Crown", "Strawberry", "Propeller Cap", "Backwards Cap", "Little Frog"]
    console.log("Migrating DB");
    const db = await SQLite.openDatabaseAsync('hydration.db');
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS records (time TIMESTAMP(20) DEFAULT CURRENT_TIMESTAMP NOT NULL, steps INT(20),hydration INT(20),PRIMARY KEY(time));
        CREATE TABLE IF NOT EXISTS user (name TEXT(20),height INT(20),weight INT(20),gender CHAR(1),coins INT(20), frogName TEXT(20), frogColor TEXT(20), PRIMARY KEY(name));
        CREATE TABLE IF NOT EXISTS bottles (size INT(20), PRIMARY KEY (size));
        CREATE TABLE IF NOT EXISTS hats (hatId INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, filePath TEXT, price INTEGER, purchased BOOLEAN DEFAULT 0);
    `).catch(function () {
        console.log("Create Table Promise Rejected");
    });
    const name: { name: string } | null = await db.getFirstAsync('SELECT name FROM user');
    if (name == null) {
        await db.runAsync(
            `INSERT INTO user (name, height, weight, gender, coins, frogName, frogColor)
             VALUES (?, ?, ?, ?, ?, ?, ?);`,
            ["null", 0, 0, "U", 3000, "null", "green"]
        ).catch(function () {
            console.log("Preference Promise Rejected");
        });
        for (let i = 1; i <= 7; i++) {
            await db.runAsync(
                `INSERT INTO hats (name, filePath, price)
             VALUES (?, ?, ?);`,
                [hat_names[i-1], "hat"+i+".png", i*100]
            ).catch(function () {
                console.log("Preference Promise Rejected");
            });
        }
        return null;
    } else if (name?.name == "null") {
        return null;
    } else {
        return name?.name;
    }
}

const styles = StyleSheet.create({
    bottleAmount: {
        marginLeft: 'auto',
        marginRight: 'auto',
        color: 'white',
        fontFamily: "Jua",
    },
    bottleContainer: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: "#5FC1FF",
        flexDirection: 'row',
        alignSelf: 'center',
        width: '80%',
        borderRadius: 20,
        borderBottomWidth: 4,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: "#0065A3",
    },
    saved: {
        padding: 10,
        fontSize: 20,
        textAlign: 'center',
        fontFamily: "Jua",
    },
    text: {
        padding: 10,
        paddingTop: 80,
        fontSize: 24,
        textAlign: "center",
        fontFamily: "Jua",
    },
    intake: {
        fontSize: 48,
        backgroundColor: "#5FC1FF",
        lineHeight: 100,
        width: '90%',
        alignSelf: 'center',
        textAlign: "center",
        fontFamily: "Jua",
        borderRadius: 20,
        color: 'white',
        borderBottomWidth: 8,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderColor: "#0065A3",
    },
    content: {
        flex: 1,
        padding: 0,
        gap: 16,
    },
    buttons: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        width: '80%',

    },
});
