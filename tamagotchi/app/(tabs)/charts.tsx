import {StyleSheet, ScrollView} from 'react-native';
import React, {useState} from "react";
import { BarChart } from "react-native-gifted-charts";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";

export default function Charts() {

    const [week, setWeek] = useState("Nov 11 - Nov 17");

    const barData = [
        {value: 250, label: 'M'},
        {value: 500, label: 'T', frontColor: '#5FC1FF'},
        {value: 745, label: 'W', frontColor: '#5FC1FF'},
        {value: 320, label: 'T'},
        {value: 600, label: 'F', frontColor: '#5FC1FF'},
        {value: 256, label: 'S'},
        {value: 300, label: 'S'},
    ];


    return (
        <>
            <ScrollView>
                <ThemedView style={styles.chart}>
                    <ThemedText style={styles.text}>Weekly Overview</ThemedText>
                    <ThemedText style={styles.week}>{week}</ThemedText>
                    <BarChart
                        barWidth={22}
                        noOfSections={3}
                        barBorderRadius={4}
                        frontColor="lightgray"
                        data={barData}
                        yAxisThickness={0}
                        xAxisThickness={0}
                    />
                </ThemedView>
                <ThemedText style={styles.achievements}>Achievements</ThemedText>
            </ScrollView>
        </>
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
    },
    chart: {
        alignSelf: "center",
        width: "95%",
        marginTop: 50,
        padding: 16
    },
    text: {
        alignSelf: "center",
        fontSize: 24,
        margin: 10
    },
    week: {
        fontSize: 16,
        backgroundColor: "#5FC1FF",
        alignSelf: "center",
        paddingHorizontal: 5,
        borderRadius: 4,
    },
    achievements: {
        fontSize: 24,
        marginTop: 24,
        backgroundColor: "#5FC1FF",
        width: "100%"
    }
});