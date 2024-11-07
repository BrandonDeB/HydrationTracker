import * as SQLite from 'expo-sqlite';
import {useState, useEffect } from 'react';
import {Button, View, StyleSheet} from "react-native";
import {NumberInput, Text} from "react-native-ui-lib";
import { router } from 'expo-router';
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import AddBottle from "../addBottle"
import CustomAmount from "@/app/customAmount";


export default function HomeScreen() {

    const [hydrationLevel, setHydrationLevel] = useState(100);
    const [waterIntake, setWaterIntake] = useState(0);
    const [waterBottles, setWaterBottles] = useState([0]);
    const [addBottleBool, setAddBottleBool] = useState(false);  // False if going to Add Bottle page and True if going to custom amount
    const [showPopup, setShowPopup] = useState(false);
    const [size, setSize] = useState(0);

    async function saveBottle() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const bottleSize: { size: number } | null = await db.getFirstAsync('SELECT size FROM bottles WHERE size = '+size);
        if (bottleSize == null) {
            await db.runAsync(
                `INSERT INTO bottles (size) VALUES (?);`,
                [size]
            ).catch(function () {
                console.log("Bottle Add Promise Rejected");
            });
            await pullBottles();
            setShowPopup(false);
        } else {
            console.log(bottleSize.size);
        }
    }



    async function pullBottles() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const allBottles: any = await db.getAllAsync('SELECT * FROM bottles').catch(function () {
            console.log("All Bottles Promise Rejected");
        });
        for (const bottle of allBottles) {
            console.log("Setting water bottles")
            setWaterBottles([...waterBottles, bottle.size]);
        }
    }

    function changeIntake(amount: number) {
        setWaterIntake(amount);
    }

    function addNewBottle() {
        setAddBottleBool(true);
        setSize(0);
        setShowPopup(true);
    }

    function addCustomAmount() {
        setAddBottleBool(false);
        setShowPopup(true);
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
            {showPopup ? (addBottleBool ?
                    <ThemedView style={styles.content}>
                        <Button title={'Back'} onPress={() => setShowPopup(false)}></Button>
                        <NumberInput initialNumber={0} fractionDigits={0} onChangeNumber={(value) => setSize(Number(value.userInput))}/>
                        <Button title={'Save'} onPress={saveBottle}></Button>
                    </ThemedView>
            :       <ThemedView style={styles.content}>
                        <Button title={'Back'} onPress={() => setShowPopup(false)}></Button>
                        <Button title={'Save'} onPress={saveBottle}></Button>
                    </ThemedView>
            ) :
                <ThemedView style={styles.content}>
                    <ThemedText style={styles.text}>Today's Total Intake</ThemedText>
                    <ThemedText>{waterIntake}</ThemedText>
                    <ThemedText>Saved Water Bottles</ThemedText>
                    {
                        waterBottles.map((bottle) => (
                            <ThemedText key={bottle}>{bottle}</ThemedText>
                        ))
                    }
                    <Button title={'Add New Bottle'} onPress={addNewBottle}></Button>
                    <Button title={'Add Custom Amount'} onPress={addCustomAmount}></Button>
                </ThemedView>
            }
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

