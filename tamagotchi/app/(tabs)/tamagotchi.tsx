import {Image, StyleSheet, Platform, ScrollView, Button} from 'react-native';
import * as SQLite from 'expo-sqlite';
import {useEffect} from "react";

export default function Tamagotchi() {

    useEffect(() => {
        async function setup() {
            const db = await SQLite.openDatabaseAsync('hydration.db');
            // `getFirstAsync()` is useful when you want to get a single row from the database.
            const allRow: any = await db.getAllAsync('SELECT * FROM user').catch(function () {
                console.log("Promise Rejected");
            });
            for (const row of allRow) {
                console.log(row.name, row.height, row.weight);
            }
        }
        setup();
    }, []);

    return (
        <Button title={'Games'}></Button>
    );
}