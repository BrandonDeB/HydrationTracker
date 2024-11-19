import {StyleSheet} from 'react-native';
import React, {useState} from "react";
import {ThemedView} from "@/components/ThemedView";
import {Text} from "react-native-ui-lib";

export default function Shop() {

    const [hats, setHats] = useState([]);

    return (
        <ThemedView>
            <Text style={styles.header}>This is the shop page!</Text>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    header: {
        marginTop: 60,
        fontSize: 48,
    }
});