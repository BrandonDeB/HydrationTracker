import React, {useCallback, useEffect, useState} from "react";
import {Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as SQLite from "expo-sqlite";
import HatCard from "@/components/HatCard";
import {useFocusEffect} from "expo-router";

interface Hat {hatId: number, price: number, name: string, filePath: string, purchased: boolean}

export const HatSelectModal: React.FC<{
    isVisible: boolean;
    onClose: () => void;
    onSelect: (hatId: number) => void;
}> = ({ isVisible, onClose, onSelect}) => {

    const images = require.context('../assets/drawings', true);

    const [hats, setHats] = useState<Hat[]>([]);

    async function loadHats() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const hats: any = await db.getAllAsync('SELECT * FROM hats WHERE purchased = 1').catch(function () {
            console.log("Hats Promise Rejected");
        });
        console.log(hats);
        setHats(hats);
    }

    useFocusEffect(
        useCallback(() => {
            loadHats();
        }, [])

    );

    return (
        <Modal visible={isVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Select a Hat!</Text>
                    <ScrollView>
                        <View style={styles.hatGrid}>
                        {
                            hats.map((hat: Hat) => (
                                <HatCard id={hat.hatId} name={hat.name} key={hat.hatId} image={hat.filePath} purchased={hat.purchased} onPress={() => onSelect(hat.hatId)} />
                            ))
                        }
                        </View>
                    </ScrollView>
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            onPress={() => onSelect(0)}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>Clear Hat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    contentContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
        width: '100%',
        paddingBottom: 34,
        // Add shadow styles
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,  // Negative value for top shadow
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 16,  // For Android
    },
    hatGrid: {
        padding: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#6A5B6E',
        paddingVertical: 16,
        borderRadius: 8,
        marginTop: 16,
        marginBottom: 8,
        marginHorizontal: 16,
        width: "40%"
    },
});