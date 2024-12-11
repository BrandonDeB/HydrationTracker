import {StyleSheet, ScrollView, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from "react";
import {BarChart, LineChart} from "react-native-gifted-charts";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import * as SQLite from "expo-sqlite";
import {RadioButton, RadioGroup} from "react-native-ui-lib";
import {useFocusEffect} from "expo-router";
import {ProgressBar} from "react-native-paper";

export default function Charts() {

    const [barData, setBarData] = useState([]);
    const [bar, setBar] = useState(true);
    const [lineData, setLineData] = useState([]);


    // Sample achievements data with progress tracking
    const [achievements, setAchievements] = useState<any[]>([]);

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

    async function pullAchievementProgress() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        let oH = 0;
        let tH = 0;
        let sP = 0;
        let hP = 0;
        const hatProgress: any = await db.getFirstAsync(`
                SELECT 
            COUNT(*) AS totalHats,
            SUM(CASE WHEN purchased = 1 THEN 1 ELSE 0 END) AS purchasedHats
        FROM hats;`).catch(function () {
            console.log("Hat Progress Promise Rejected");
        });
        if (hatProgress != null) {
            tH = hatProgress.totalHats;
            oH = hatProgress.purchasedHats;
        }
        const streakProgress: any = await db.getFirstAsync(`
                SELECT MAX(streakLength) AS longestStreak
                FROM (
                    SELECT COUNT(*) AS streakLength
                    FROM (
                        SELECT DATE(time) AS trackingDate,
                               ROW_NUMBER() OVER (ORDER BY DATE(time)) - JULIANDAY(DATE(time)) AS streakGroup
                        FROM records
                        GROUP BY DATE(time)
                    )
                    GROUP BY streakGroup
                );`).catch(function () {
                            console.log("Streak Promise Rejected");
                        });
        if (streakProgress != null) {
            if (streakProgress.longestStreak !== null) {
                sP = streakProgress.longestStreak;
            }
        }
        const hydrationProgressDB: any = await db.getFirstAsync(`
                SELECT SUM(hydration) AS totalHydration FROM records;
        `).catch(function () {
            console.log("Hydration Progress Promise Rejected");
        });
        if (hydrationProgressDB != null) {
            if (hydrationProgressDB.totalHydration !== null) {
                console.log("Settings hydration progress")
                hP = hydrationProgressDB.totalHydration;
            }
        }
        let arr = []
        if (sP < 7) {
            arr.push({id: 1, description: "Track water intake for 7 consecutive days.", progress: sP, goal: 7})
        }
        if (hP < 1000) {
            arr.push({id: 2, description: "Drink 1000 fl oz of water", progress: hP, goal: 1000})
        }
        if (oH < tH) {
            arr.push({id: 3, description: "Unlock 5 hats.", progress: oH, goal: 5})
        }
        setAchievements(arr)
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
        const records: any = await db.getAllAsync('SELECT * FROM records').catch(function () {
            console.log("All Bottles Promise Rejected");
        });
        setLineData(hydration);
    }

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

    useFocusEffect(
        useCallback(() => {
            pullAchievementProgress();
        }, [])

    );

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
                    </RadioGroup>
                </ThemedView>

                <ThemedView>
                    <Text style={styles.achievementsHeader}>Achievements</Text>
                    <ScrollView style={styles.achievementsPane}>
                        {achievements.length > 0 ? (
                            achievements.map((item) => {
                                    const progress = isNaN(item.progress) || item.progress < 0 ? 0 : item.progress;
                                    const goal = isNaN(item.goal) || item.goal <= 0 ? 1 : item.goal; // Avoid division by zero
                                    const clampedProgress = Math.round(Math.min(1, Math.max(0, (progress / goal)))*10000)/10000;
                                    return(
                                        <View key={item.id} style={styles.achievementItem}>
                                            <Text style={styles.achievementDescription}>{item.description}</Text>

                                            {/* Progress Bar */}
                                            <ProgressBar
                                                animatedValue={clampedProgress}
                                                color={getProgressColor(progress, goal)}
                                                style={styles.progressBar}
                                            />

                                            {/* Progress Percentage */}
                                            <Text style={styles.progressText}>
                                                {Math.round(calculateProgress(progress, goal))}% Complete
                                            </Text>
                                        </View>
                                    );
                                }
                                )
                        ) : (
                            <Text>No more achievements!</Text>
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
        fontFamily: 'Jua',
    },
    achievementsHeader: {
        fontSize: 24,
        marginTop: 24,
        width: '70%',
        alignSelf: 'center',
        borderRadius: 20,
        backgroundColor: "#5FC1FF",
        textAlign: "center",
        padding: 8,
        color: "#ffffff",
        fontFamily: 'Jua',
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
        fontSize: 16,
        marginBottom: 8,
        color: "black",
        fontFamily: "Jua",
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
