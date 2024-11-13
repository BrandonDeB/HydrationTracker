import {useState} from "react";
import * as SQLite from "expo-sqlite";
import {router} from "expo-router";
import {ThemedView} from "@/components/ThemedView";
import {NumberInput} from "react-native-ui-lib";
import {Button, StyleSheet} from "react-native";
import {ThemedText} from "@/components/ThemedText";

export default function HydrationBar () {


    return (
        <>
            <ThemedView style={styles.bar}></ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    bar: {
        width: "60%",
        height: "5%",
        alignSelf: "center",
        backgroundColor: "#5FC1FF"
    }
});