import {StyleSheet, ScrollView, View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from "react";
import { BarChart } from "react-native-gifted-charts";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import { ProgressBar } from 'react-native-paper';

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

    // Sample achievements data with progress tracking
    const [achievements, setAchievements] = useState([
        {description: "Track water intake for 7 consecutive days.", progress: 5, goal: 7},
        {description: "Hit your hydration goal 5 times in a week.", progress: 3, goal: 5},
        {description: "Log water before 9 AM for 3 days in a row.", progress: 2, goal: 3},
    ]);

    // Function to calculate progress percentage
    const calculateProgress = (progress, goal) => (progress / goal) * 100;

    const getProgressColor = (progress, goal) => {
        const percentage = calculateProgress(progress, goal);
        if (percentage > 75) return "#4CAF50"; // Green
        if (percentage > 50) return "#FFC107"; // Yellow
        return "#F44336"; // Red
    };

    // Function to remove completed achievements
    const filterAchievements = () => {
        setAchievements(achievements.filter(item => item.progress < item.goal));
    };

    
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

                {/* Achievements Section */}
                <Text style={styles.achievementsHeader}>Achievements</Text>
                {achievements.length > 0 ? (
                <FlatList
                    contentContainerStyle={styles.achievementsPane}
                    data={achievements}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => (
                        <View style={styles.achievementItem}>
                            <Text style={styles.achievementDescription}>{item.description}</Text>
                            
                            {/* Progress Bar */}
                            <ProgressBar 
                                progress={item.progress / item.goal}
                                color={getProgressColor(item.progress, item.goal)}
                                style={styles.progressBar}
                            />

                            {/* Progress Percentage */}
                            <Text style={styles.progressText}>
                                {Math.round(calculateProgress(item.progress, item.goal))}% Complete
                            </Text>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.emptyAchievements}>No achievements to display.</Text>
            )}

            {/* Clear Completed Achievements Button */}
            {achievements.length > 0 && (
                <TouchableOpacity onPress={filterAchievements} style={styles.clearButton} activeOpacity = {0.8}>
                    <Text style={styles.clearButtonText}>Clear Completed Achievements</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
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
    achievementsHeader: {
        fontSize: 24,
        marginTop: 24,
        backgroundColor: "#5FC1FF",
        textAlign: "center",
        padding: 8,
        color: "#ffffff"
    },
    achievementsPane: {
        padding: 16,
    },
    achievementItem: {
        backgroundColor: "#e3f2fd",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    achievementDescription: {
        fontSize: 16,
        marginBottom: 8,
        color: "#455a64"
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
    clearButton: {
        alignSelf: "center",
        backgroundColor: "#d32f2f",
        padding: 10,
        borderRadius: 8,
        marginTop: 16,
    },
    clearButtonText: {
        color: "#ffffff",
        fontSize: 16,
        textAlign: "center",
    },
});
