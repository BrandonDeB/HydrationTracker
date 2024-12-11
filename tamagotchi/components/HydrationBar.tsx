import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import {ThemedView} from "@/components/ThemedView";
import * as SQLite from "expo-sqlite";
import {useFocusEffect} from "expo-router";

export default function HydrationBar() {
    const [hydration, setHydration] = useState(100); // Initial hydration level
    const windowWidth = Dimensions.get('window').width;

    // Simulate hydration decrease over time
    useEffect(() => {
        const interval = setInterval(() => {
            setHydration((prev) => Math.max(0, prev - .05)); // Decrease by 0.1% per second
        }, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    useFocusEffect(
        useCallback(() => {
        async function fetchHydration() {
            try {
                const query = `
                    SELECT 
                        SUM(hydration) AS total_hydration,
                        MAX(time) AS last_drink_time
                    FROM 
                        records
                    WHERE 
                        time > DATETIME('now', '-24 hours');
                    `;
                const db = await SQLite.openDatabaseAsync('hydration.db');
                const result: {total_hydration: number, last_drink_time: Date} | null = await db.getFirstAsync(query);
                if (result !== null) {
                    console.log(result);
                    const totalHydration = result.total_hydration || 0;
                    const lastDrinkTime = result.last_drink_time;
                    const currentTime = new Date().getTime();

                    // Calculate time elapsed since last drink (in hours)
                    const timeElapsed = (currentTime - new Date(lastDrinkTime).getTime()) / (1000 * 60 * 60);

                    // Decay rate: 2% hydration lost per hour
                    const decay = timeElapsed * 10;
                    console.log(totalHydration);
                    console.log(decay);
                    const currentHydration = Math.max(0, totalHydration - decay);
                    console.log(currentHydration);
                    setHydration(currentHydration);
                }
            } catch (error) {
                console.error('Failed to fetch hydration data:', error);
            }
        }

        fetchHydration();
        }, [])

        // Polling or WebSocket logic to fetch data in real time can go here
    );

    return (
        <ThemedView style={[styles.container, {width: windowWidth/2}]}>
            <View style={styles.barBackground}>
            <View
                style={{
                    ...styles.bar,
                    width: `${Math.min(hydration, 100)}%`, // Bar width reflects hydration percentage
                }}
            />
            </View>
            <Text style={styles.text}>{`${Math.min(hydration, 100).toFixed(0)}%`}</Text>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        overflow: 'hidden',
        marginHorizontal: 30,
        backgroundColor: "transparent"
    },
    bar: {
        left: 0,
        height: '100%',
        backgroundColor: '#4caf50',
        alignSelf: "flex-start",
        borderRadius: 10,
    },
    barBackground: {
        width: "100%",
        height: "50%",
        alignSelf: "center",
        borderRadius: 10,
        backgroundColor: "#e0e0e0",
        marginHorizontal: 20,
        borderWidth: 1,
    },
    text: {
        alignSelf: "center",
        color: "white",
        fontSize: 18
    }
});