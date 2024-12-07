import {
    Text,
    RadioGroup,
    RadioButton,
    TextField,
    WheelPicker,
    WheelPickerProps,
    NumberInput
} from 'react-native-ui-lib';
import {Component, useMemo, useState} from "react";
import { ThemedView } from '@/components/ThemedView';
import {Button, StyleSheet} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import * as SQLite from "expo-sqlite";
import {router} from "expo-router";

export default function CustomAmount () {

    const [size, setSize] = useState(0);
    const [steps, setSteps] = useState(0);

    async function saveCustomAmount() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        await db.runAsync(
            `INSERT INTO records (steps, hydration) VALUES (?, ?);`,
            [steps, size]
        ).catch(function () {
            console.log("Custom Amount Failed");
        });
        router.replace('/(tabs)');
    }

    return (
        <>
            <ThemedView style={styles.content}>
                <NumberInput trailingText={'fl oz'} textFieldProps={{style: styles.text}} trailingTextStyle={styles.text} onChangeNumber={(sizeValue) => setSize(Number(sizeValue.userInput))} fractionDigits={0} />
                <Button title={'Custom Amount'} onPress={saveCustomAmount}></Button>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
    },
    container: {
        flex: 1,
        backgroundColor: '#5FC1FF',
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