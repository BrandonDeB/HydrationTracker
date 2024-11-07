import {Text, RadioGroup, RadioButton, TextField, WheelPicker, WheelPickerProps} from 'react-native-ui-lib';
import {Component, useMemo, useState} from "react";
import { ThemedView } from '@/components/ThemedView';
import {Button, StyleSheet} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import * as SQLite from "expo-sqlite";
import {router} from "expo-router";

export default function CustomAmount () {

    const [size, setSize] = useState(5);

    async function saveBottle() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        await db.runAsync(
            `INSERT INTO bottles (size) VALUES (?);`,
            [size]
        ).catch(function () {
            console.log("Bottle Add Promise Rejected");
        });
        router.replace('/(tabs)/')
    }

    return (
        <>
            <ThemedView style={styles.content}>
                <Button title={'Custom Amount'} onPress={saveBottle}></Button>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 28,
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