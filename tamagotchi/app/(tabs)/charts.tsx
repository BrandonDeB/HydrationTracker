import {StyleSheet, ScrollView, View, Text} from 'react-native';
import React, {useState, useEffect} from "react";
import { BarChart } from "react-native-gifted-charts";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import { ProgressBar } from 'react-native-paper';

export default function Charts({waterIntakeData}) {   //NEEDS PARENT COMPONENT TO TRACK/UPDATE WATER INTAKE BASED ON GOALS...

    const [week, setWeek] = useState("Nov 11 - Nov 17");

    const [achievements, setAchievements] = useState([
        {id: 1, description: "Track water intake for 7 consecutive days.", progress: 0, goal: 7},
        {id: 2, description: "Hit your hydration goal 5 times in a week.", progress: 0, goal: 5},
        {id: 3, description: "Log water before 9 AM for 3 days in a row.", progress: 0, goal: 3},
    ]);
    
    const barData = [
        {value: 250, label: 'M'},
        {value: 500, label: 'T', frontColor: '#5FC1FF'},
        {value: 745, label: 'W', frontColor: '#5FC1FF'},
        {value: 320, label: 'T'},
        {value: 600, label: 'F', frontColor: '#5FC1FF'},
        {value: 256, label: 'S'},
        {value: 300, label: 'S'},
    ];

    // Update achievements based on actual user tracking data w waterIntakeData prop
    useEffect(() => {
        if (waterIntakeData) {
            setAchievements(prevAchievements => prevAchievements.map(item => {
                let newProgress = item.progress;

                // Update progress based on the achievement type
                if (item.id === 1) {
                    // Track water intake for 7 consecutive days
                    newProgress = Math.min(item.goal, waterIntakeData.consecutiveDays);
                } else if (item.id === 2) {
                    // Hit hydration goal 5 times in a week
                    newProgress = Math.min(item.goal, waterIntakeData.daysGoalMet);
                } else if (item.id === 3) {
                    // Log water before 9 AM for 3 days in a row
                    newProgress = Math.min(item.goal, waterIntakeData.daysLoggedBefore9AM);
                }

                return {...item, progress: newProgress};
            }));
        }
    }, [waterIntakeData]);


    // Function to calculate progress percentage
    const calculateProgress = (progress, goal) => {
        if (goal === 0) return 0;
        return Math.round((progress / goal) * 100);
    };

    const getProgressColor = (progress, goal) => {
        if (goal === 0) return "#F44336";
        const percentage = calculateProgress(progress, goal);
        if (percentage > 75) return "#4CAF50"; // Green
        if (percentage > 50) return "#FFC107"; // Yellow
        return "#F44336"; // Red
    };
    
    const hasAchievements = Array.isArray(achievements) && achievements.length > 0;

    return (
        <View>
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
            
            {/* Achievements Section */}
            <ThemedView>
                <Text style={styles.achievementsHeader}>Achievements</Text>
                <ScrollView style={styles.achievementsPane}>
                    {hasAchievements ? (
                        achievements.map((item) => {
                            const clampedProgress = item.goal === 0 ? 0 : Math.min(1, Math.max(0, parseFloat((item.progress / item.goal).toFixed(2))));
                            const progressPercentage = calculateProgress(item.progress, item.goal);

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
                                        {progressPercentage}% Complete
                                    </Text>
                                </View>
                            );
                        })
                    ) : (
                        <Text style={styles.emptyAchievements}>No achievements to display.</Text>
                    )}
                </ScrollView>
            </ThemedView>
        </View>
    );
}
               
const styles = StyleSheet.create({
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
    week: {
        fontSize: 16,
        backgroundColor: "#5FC1FF",
        alignSelf: "center",
        paddingHorizontal: 5,
        borderRadius: 4,
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
        maxHeight: 300,
        padding: 16,
    },
    achievementItem: {
        backgroundColor: "#cbe7fb",
        borderRadius: 8,
        padding: 16,
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
        color: "#455a64",
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        marginBottom: 8,
    },
    progressText: {
        fontSize: 14,
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
