import {StyleSheet, ScrollView, Text, View} from 'react-native';
import React, {useEffect, useState} from "react";
import {BarChart, LineChart} from "react-native-gifted-charts";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import * as SQLite from "expo-sqlite";
import {RadioButton, RadioGroup} from "react-native-ui-lib";
import { ProgressBar } from 'react-native-paper';

export default function Charts() {

    const [barData, setBarData] = useState([]);
    const [bar, setBar] = useState(true);
    const [lineData, setLineData] = useState([]);

    useEffect(() => {
        pullChartData('-6 days');
    }, []);

    async function pullChartData(days: string) {
        if (days === "-0 days") {
            await pullTodayData();
            setBar(false);
        } else {
            await pullBarData(days);
            setBar(true);
        }
    }

    async function pullBarData(days: string) {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const records: any = await db.getAllAsync(
            `
                    WITH RECURSIVE
                        date_range AS (SELECT DATE ('now', ?) AS date
                    UNION ALL
                    SELECT DATE (date, '+1 day')
                    FROM date_range
                    WHERE date
                        < DATE ('now')
                        )
                    SELECT strftime('%m/%d', date_range.date) AS label,
                           COALESCE(SUM(hydration), 0) AS value
                    FROM
                        date_range
                        LEFT JOIN
                        records
                    ON
                        DATE (records.time) = date_range.date
                    GROUP BY
                        date_range.date
                    ORDER BY
                        date_range.date DESC;

                `, [days]).catch(function () {
            console.log("Last Days Water Promise Rejected");
        });
        setBarData(records);
    }

    async function pullTodayData() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const hydration: any = await db.getAllAsync(
            `
                WITH RECURSIVE time_intervals AS (
                    -- Generate 2-hour intervals for the last 7 days
                    SELECT
                        strftime('%Y-%m-%d %H:00', date('now', '-7 days')) AS label
                    UNION ALL
                    SELECT
                        strftime('%Y-%m-%d %H:00', label, '+2 hours')
                    FROM time_intervals
                    WHERE label < date('now')
                    )
                SELECT
                    ti.label,
                    IFNULL(SUM(r.hydration), 0) AS value
                FROM
                    time_intervals ti
                        LEFT JOIN
                    records r ON strftime('%Y-%m-%d %H:00', r.time) = ti.label
                GROUP BY
                    ti.label
                ORDER BY
                    ti.label;
            `).catch(function () {
            console.log("Current Hydration Promise Rejected");
        });
        console.log(hydration);
        const records: any = await db.getAllAsync('SELECT * FROM records').catch(function () {
            console.log("All Bottles Promise Rejected");
        });
        console.log(records);
        setLineData(hydration);
    }

    // Sample achievements data with progress tracking
    const [achievements, setAchievements] = useState([
        {id: 1, description: "Track water intake for 7 consecutive days.", progress: 6, goal: 7},
        {id: 2, description: "Hit your hydration goal 5 times in a week.", progress: 1, goal: 5},
        {id: 3, description: "Log water before 9 AM for 3 days in a row.", progress: 2, goal: 3},
    ]);

    // Function to calculate progress percentage
    const calculateProgress = (progress:any, goal:any) => {
        if (goal === 0) return 0;
        return Math.round((progress / goal) * 100);
    };

    const getProgressColor = (progress: any, goal: any) => {
        if (goal === 0) return "#F44336";
        const percentage = calculateProgress(progress, goal);
        if (percentage > 75) return "#4CAF50"; // Green
        if (percentage > 50) return "#FFC107"; // Yellow
        return "#F44336"; // Red
    };

    // Automatically remove completed achievements
    useEffect(() => {
        setAchievements(prevAchievements => prevAchievements.filter(item => item.progress < item.goal));
    }, []);

    const hasAchievements = Array.isArray(achievements) && achievements.length > 0;

    return (
        <>
            <ScrollView>
                <ThemedView style={styles.chart}>
                    <ThemedText style={styles.text}>Weekly Overview</ThemedText>
                    {bar ?
                    <BarChart
                        barWidth={40}
                        noOfSections={3}
                        barBorderRadius={4}
                        frontColor="lightgray"
                        data={barData}
                        yAxisThickness={0}
                        xAxisThickness={0}
                    /> : <LineChart
                            initialSpacing={0}
                            data={lineData}
                            spacing={50}
                            textColor1="black"
                            textShiftY={-8}
                            textFontSize={13}
                            thickness={5}
                            hideRules
                            yAxisColor="#0BA5A4"
                            showVerticalLines
                            verticalLinesColor="rgba(14,164,164,0.5)"
                            xAxisColor="#0BA5A4"
                            color="#0BA5A4"/>}
                    <RadioGroup
                        initialValue={"-7 days"}
                        onValueChange={(value: string) => pullChartData(value)}
                        style={styles.radio}
                    >
                        <RadioButton
                            value={"-6 days"}
                            label={"Last 7 Days"}
                            size={15}
                            borderRadius={0}
                        />
                        <RadioButton
                            value={"-29 days"}
                            size={15}
                            borderRadius={0}
                            label={"Last 30 Days"}
                        />
                        <RadioButton
                            value={"-0 days"}
                            size={15}
                            borderRadius={0}
                            label={"Today"}
                        />
                    </RadioGroup>
                </ThemedView>
                <ThemedText style={styles.text}>Achievements</ThemedText>

                <ThemedView>
                    <Text style={styles.achievementsHeader}>Achievements</Text>
                    <ScrollView style={styles.achievementsPane}>
                        {hasAchievements ? (
                            achievements.map((item) => {
                                const clampedProgress = item.goal === 0 ? 0 : Math.min(1, Math.max(0, parseFloat((item.progress / item.goal).toFixed(2))));
                                return(
                                    <View key={item.id} style={styles.achievementItem}>
                                        <Text style={styles.achievementDescription}>{item.description}</Text>

                                        {/* Progress Bar */}
                                        <ProgressBar
                                            progress={clampedProgress}
                                            color={getProgressColor(item.progress, item.goal)}
                                            style={styles.progressBar}
                                        />

                                        {/* Progress Percentage */}
                                        <Text style={styles.progressText}>
                                            {Math.round(calculateProgress(item.progress, item.goal))}% Complete
                                        </Text>
                                    </View>
                                );
                            })
                        ) : (
                            <Text style={styles.emptyAchievements}>No achievements to display.</Text>
                        )}
                    </ScrollView>
                </ThemedView>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    radio: {
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    topBar: {
        flexDirection: "row",
        alignSelf: "center",
        margin: 50,
        width: "80%",
        backgroundColor: "rgba(76, 175, 80, 0.0)",
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
        padding: 16,
    },
    text: {
        alignSelf: "center",
        fontSize: 24,
        margin: 10,
    },
    achievementsHeader: {
        fontSize: 24,
        marginTop: 24,
        backgroundColor: "#5FC1FF",
        textAlign: "center",
        padding: 8,
        color: "#ffffff",
    },
    achievementsPane: {
        padding: 16,
    },
    achievementItem: {
        backgroundColor: "#cbe7fb",
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    achievementDescription: {
        fontSize: 20,
        marginBottom: 8,
        color: "#455a64",
    },
    week: {
        fontSize: 16,
        backgroundColor: "#5FC1FF",
        alignSelf: "center",
        paddingHorizontal: 5,
        borderRadius: 4,
    },
    progressBar: {
        height: 20,
        borderRadius: 5,
        marginBottom: 8,
    },
    progressText: {
        fontSize: 16,
        color: "#0d47a1",
        textAlign: "right",
    },
    emptyAchievements: {
        textAlign: "center",
        color: "#888",
        marginVertical: 24,
        fontSize: 16,
    },
});
