import * as SQLite from 'expo-sqlite';
import {useState, useEffect } from 'react';
import {Button, View, StyleSheet} from "react-native";
import { router } from 'expo-router';
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import Charts from './Charts';

export default function HomeScreen() {

    const [waterIntake, setWaterIntake] useState({
        totalWaterIntake: 0,
        consecutiveDays: 0,
        daysGoalMet: 0,
        daysLoggedBefore9AM: 0,
    });
    const [waterBottles, setWaterBottles] = useState([]);
    const [steps, setSteps] = useState(0);

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
        if (hydration[0]?.total_hydration != null) {
            setWaterIntake(prevData => ({
                ...prevData,
                totalWaterIntake: hydration[0].total_hydration,
            }));
        }
    }

    async function drinkBottle(size: number) {
        setWaterIntake(prevData => {
            const updatedData = {
                ...prevData,
                totalWaterIntake: prevData.totalWaterIntake + size,
                // Example: Update goals accordingly based on totalWaterIntake and consecutiveDays
                daysGoalMet: (prevData.totalWaterIntake + size) >= 100 ? prevData.daysGoalMet + 1 : prevData.daysGoalMet,
                consecutiveDays: prevData.consecutiveDays + 1, // Example logic for consecutive days
            };
            return updatedData;
        });
        
        const db = await SQLite.openDatabaseAsync('hydration.db');
        await db.runAsync(
            `INSERT INTO records (steps, hydration) VALUES (?, ?);`,
            [steps, size]
        ).catch(function () {
            console.log("Bottle Add Promise Rejected");
        });
    }

    async function removeBottle(size: number) {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        await db.runAsync(
            `DELETE FROM bottles WHERE size=?;`, size
        ).catch(function () {
            console.log("Bottle Remove Promise Rejected");
        });
        await pullBottles();
    }

    function addNewBottle() {
        router.push('/addBottle')
    }

    function addCustomAmount() {
        router.push('/customAmount')
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
        }
        setup();
    }, []);

    return (
        <>
            <ThemedView style={styles.content}>
                <ThemedText style={styles.text}>Today's Total Intake</ThemedText>
                <ThemedText style={styles.intake}>{waterIntake} fl oz</ThemedText>
                <ThemedText style={styles.saved}>Saved Water Bottles</ThemedText>
                {
                    waterBottles.map((bottle: {size: number}, index) => (
                        <ThemedView style={styles.bottleContainer} key={index*4}>
                            <Button key={index*4+4} title={'-'} onPress={() => removeBottle(bottle.size)}></Button>
                            <ThemedText style={styles.bottleAmount} key={index*4+1}>{bottle.size}</ThemedText>
                            <Button key={index*4+2} title={'+'} onPress={() => drinkBottle(bottle.size)}></Button>
                        </ThemedView>
                    ))
                }
                <ThemedView style={styles.buttons}>
                    <Button color={"#5FC1FF"} title={'Add New Bottle'} onPress={addNewBottle}></Button>
                    <Button color={"#5FC1FF"} title={'Add Custom Amount'} onPress={addCustomAmount}></Button>
                </ThemedView>

                {/* Pass waterIntake to Charts component */}
                <Charts waterIntakeData={waterIntake} />
            </ThemedView>
        </>
    )
}

async function migrateDbIfNeeded() {
    console.log("Migrating DB");
    const db = await SQLite.openDatabaseAsync('hydration.db');
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS records (time TIMESTAMP(20) DEFAULT CURRENT_TIMESTAMP NOT NULL, steps INT(20),hydration INT(20),PRIMARY KEY(time));
        CREATE TABLE IF NOT EXISTS user (name TEXT(20),height INT(20),weight INT(20),gender CHAR(1),coins INT(20), PRIMARY KEY(name));
        CREATE TABLE IF NOT EXISTS bottles (size INT(20), PRIMARY KEY (size));
    `).catch(function () {
        console.log("Create Table Promise Rejected");
    });
    const name: { name: string } | null = await db.getFirstAsync('SELECT name FROM user');
    if (name == null) {
        await db.runAsync(
            `INSERT INTO user (name, height, weight, gender, coins)
             VALUES (?, ?, ?, ?, ?);`,
            ["null", 0, 0, "U", 0]
        ).catch(function () {
            console.log("Preference Promise Rejected");
        });
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
        marginRight:'auto'
    },
    bottleContainer: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: "#5FC1FF",
        flexDirection: 'row',
        alignSelf: 'center',
        width: '80%'
    },
    saved: {
        padding: 10,
        fontSize: 16,
        textAlign: 'center',
        fontFamily: "Jua"
    },
    text: {
        padding: 10,
        paddingTop: 80,
        fontSize: 24,
        lineHeight: 32,
        textAlign: "center",
        fontFamily: "Jua"
    },
    intake: {
        fontSize: 48,
        width: '100%',
        backgroundColor: "#5FC1FF",
        lineHeight: 100,
        textAlign: "center",
        fontFamily: "Jua"
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
        padding: 0,
        gap: 16,
        height: "100%",
    },
    buttons: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        width: '80%',
    },
    button: {
        textAlign: "center",
    }
});

