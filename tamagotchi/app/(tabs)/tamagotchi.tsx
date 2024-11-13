import {Image, StyleSheet, Platform, ScrollView, Button} from 'react-native';
import * as SQLite from 'expo-sqlite';
import React, {useEffect} from "react";
import HydrationBar from "@/components/HydrationBar";
import {ThemedView} from "@/components/ThemedView";
import {IconButton} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Tamagotchi() {

    return (
        <>
            <ThemedView style={styles.topBar}>
                <HydrationBar></HydrationBar>
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 50
    },
    iconButton: {
        backgroundColor: "#5FC1FF",
        borderRadius: 4,
    }
});