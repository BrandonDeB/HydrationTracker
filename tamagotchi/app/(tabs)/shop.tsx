import {Image, StyleSheet, Platform, ScrollView, Button} from 'react-native';
import React, {useEffect, useState} from "react";
import HydrationBar from "@/components/HydrationBar";
import {ThemedView} from "@/components/ThemedView";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Shop() {

    const [hats, setHats] = useState([]);

    return (
        <ThemedView>
            <ThemedView style={styles.topBar}>
                <MaterialCommunityIcons name="hat-fedora" size={32} color="black" backgroundColor="#5FC1FF"/>
                <HydrationBar></HydrationBar>
                <MaterialCommunityIcons name="cog" size={32} color="black" backgroundColor="#5FC1FF"/>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: "row",
        alignSelf: "center",
        margin: 50,
        width: "80%",
        backgroundColor: "rgba(76, 175, 80, 0.0)"
    },
    iconButton: {
        borderRadius: 4,
        alignSelf: "center",
        backgroundColor: "#5FC1FF",
    }
});