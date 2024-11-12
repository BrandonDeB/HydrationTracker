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
import { router } from 'expo-router';

export default function NewUser () {

    const [name, setName] = useState("");
    const [feet, setFeet] = useState(0);
    const [weight, setWeight] = useState(0);
    const [gender, setGender] = useState("");
    const [coins, setCoins] = useState(0);
    const [inches, setInches] = useState(0);

    async function submitPress() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const existing_name = await db.getFirstAsync('SELECT name FROM user');
        if (existing_name == null) {
            console.log(existing_name);
        }
        await db.runAsync(
            `INSERT INTO user (name, height, weight, gender, coins) VALUES (?, ?, ?, ?, ?);`,
            [name, feet*12+inches, weight, gender, coins]
        ).catch(function () {
            console.log("Preference Promise Rejected");
        });
        router.replace("/(tabs)/");

    }

        const FEETCONST = [...Array(8).keys()];
        const INCHESCONST = [...Array(12).keys()];

        const feetMap = FEETCONST.map(item => ({label: item.toString(), value: item}));
        const inchesMap = INCHESCONST.map(item => ({label: item.toString(), value: item}));

        return (

            <>
                <ThemedView style={styles.content}>
                    <ThemedText style={styles.text}>👋</ThemedText>
                    <TextField style={styles.text} placeholder={'Input Name'}  onChangeText={(value: any) => setName(value)}/>
                    <RadioGroup initialValue={"Unspecified"} onValueChange={(value: any) => setGender(value)}>
                        <Text marginB-20 text60 $textDefault>
                            Sex{'\n'}
                        </Text>
                        <RadioButton value={"M"} label={"Male"}/>
                        <RadioButton value={"F"} label={"Female"}/>
                        <RadioButton value={"U"} label={"Unspecified"}/>
                    </RadioGroup>
                    <WheelPicker  items={feetMap}  initialValue={0}  onChange={(value: any) => setFeet(value)}/>
                    <WheelPicker  items={inchesMap}  initialValue={0}  onChange={(value: any) => setInches(value)}/>
                    <Button title="Submit" onPress={submitPress} color="#841584" />
                    <NumberInput leadingText={"Weight"} leadingTextStyle={styles.text} containerStyle={styles.content} onChangeNumber={(weightValue) => setWeight(Number(weightValue.userInput))} fractionDigits={0} />
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