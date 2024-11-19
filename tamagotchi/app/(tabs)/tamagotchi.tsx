import {StyleSheet} from 'react-native';
import React from "react";
import HydrationBar from "@/components/HydrationBar";
import {ThemedView} from "@/components/ThemedView";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {router} from "expo-router";
import * as SQLite from "expo-sqlite";

export default function Tamagotchi() {

    function goToHats() {
        console.log("Hats");
    }

    async function onSettingsPress() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const allUsers: any = await db.getAllAsync('SELECT * FROM user').catch(function () {
            console.log("All Bottles Promise Rejected");
        });
        console.log(allUsers);
        router.push('/newUser');
    }

    return (
        <ThemedView>
            <ThemedView style={styles.topBar}>
                <MaterialCommunityIcons name="hat-fedora" size={32} color="black" backgroundColor="#5FC1FF"/>
                <HydrationBar />
                <MaterialCommunityIcons onPress={() => {onSettingsPress()}} name="cog" size={32} color="black" backgroundColor="#5FC1FF"/>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: "row",
        alignSelf: "center",
        margin: 50,
        padding: 10,
        justifyContent: "space-between",
        backgroundColor: "rgba(76, 175, 80, 0.0)"
    },
    iconButton: {
        borderRadius: 4,
        backgroundColor: "#5FC1FF",
    }
});