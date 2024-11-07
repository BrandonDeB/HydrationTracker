import * as SQLite from 'expo-sqlite';
import {useState, useEffect } from 'react';
import {Button, View, StyleSheet} from "react-native";
import { router } from 'expo-router';
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {number} from "prop-types";


export default function HomeScreen() {

    const [hydrationLevel, setHydrationLevel] = useState(100);
    const [waterIntake, setWaterIntake] = useState(0);
    const [waterBottles, setWaterBottles] = useState([]);

    async function pullBottles() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const allBottles: any = await db.getAllAsync('SELECT * FROM bottles').catch(function () {
            console.log("All Bottles Promise Rejected");
        });
        setWaterBottles(allBottles);
    }

    function addNewBottle() {
        router.replace('/addBottle')
    }

    function addCustomAmount() {
        router.replace('/customAmount')
    }

    useEffect(() => {
        async function setup() {
            const db = await SQLite.openDatabaseAsync('hydration.db');
            // db.execSync('DROP TABLE user');
            // db.execSync('DROP TABLE records');
            // db.execSync('DROP TABLE bottles');
            if (await migrateDbIfNeeded() == null) {
                router.push('/NewUser');
            }
            await pullBottles();
        }
        setup();
    }, []);

    return (
        <>
            <ThemedView style={styles.content}>
                <ThemedText style={styles.text}>Today's Total Intake</ThemedText>
                <ThemedText style={styles.text}>{waterIntake}</ThemedText>
                <ThemedText>Saved Water Bottles</ThemedText>
                {
                    waterBottles.map((bottle: {size: number}, index) => (
                        <ThemedView key={index*3}>
                            <ThemedText key={index*3+1}>{bottle.size}</ThemedText>
                            <Button key={index*3+2} title={'+'} onPress={() => setWaterIntake(waterIntake+bottle.size)}></Button>
                        </ThemedView>
                    ))
                }
                <Button title={'Add New Bottle'} onPress={addNewBottle}></Button>
                <Button title={'Add Custom Amount'} onPress={addCustomAmount}></Button>
            </ThemedView>
        </>
    )
}

async function migrateDbIfNeeded() {
    console.log("Migrating DB");
    const db = await SQLite.openDatabaseAsync('hydration.db');
    await db.execAsync(`
            CREATE TABLE IF NOT EXISTS records (
                time TIMESTAMP(20),
                steps INT(20),
                hydration INT(20),
                PRIMARY KEY (time)
            );
            CREATE TABLE IF NOT EXISTS user (
                name TEXT(20),
                height INT(20),
                weight INT(20),
                gender CHAR(1),
                coins INT(20),
                PRIMARY KEY(name)
            );
            CREATE TABLE IF NOT EXISTS bottles (
                size INT(20),
                PRIMARY KEY(size)
            );
        `).catch(function () {
        console.log("Create Table Promise Rejected");
    });
    console.log("Migrated DB");
    const name: { name: string } | null = await db.getFirstAsync('SELECT name FROM user');
    if (name == null) {
        console.log("name is null")
        return null;
    } else {
        console.log(name.name);
        return name.name;
    }
}

const styles = StyleSheet.create({
    text: {
        padding: 20,
        fontSize: 56,
        lineHeight: 32,
        marginTop: -6,
    },
    container: {
        flex: 1,
    },
    header: {
        height: 250,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        padding: 32,
        gap: 16,
        overflow: 'hidden',
    },
});

