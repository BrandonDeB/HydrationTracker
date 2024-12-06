import {ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from "react";
import {ThemedView} from "@/components/ThemedView";
import {Text} from "react-native-ui-lib";
import * as SQLite from "expo-sqlite";
import HatCard from "@/components/HatCard";

export default function Shop() {

    const [hats, setHats] = useState<{hatID: number, price: number, name: string, filePath: string, purchased: boolean}[]>([]);

    async function loadHats() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const hats: any = await db.getAllAsync('SELECT * FROM hats').catch(function () {
            console.log("Hats Promise Rejected");
        });
        console.log(hats);
        setHats(hats);
    }

    useEffect(() => {
        loadHats()
    }, [])

    return (
        <ScrollView>
            <Text style={styles.header}>This is the shop page!</Text>
            {
                hats.map((hat: any) => (
                    <HatCard id={hat.hatId} price={hat.price} name={hat.name} key={hat.hatId} image={hat.filePath} purchased={hat.purchased} />
                ))
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        marginTop: 60,
        fontSize: 48,
    }
});