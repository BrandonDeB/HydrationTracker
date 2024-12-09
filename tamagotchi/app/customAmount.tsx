import React, { useState } from 'react';
import { Button, Modal, View, StyleSheet } from 'react-native';
import { NumberInput } from 'react-native-ui-lib';
import * as SQLite from 'expo-sqlite';

interface CustomAmountProps {
    visible: boolean;
    onClose: () => void;
    onDataUpdated: () => void;
}

export default function CustomAmount({ visible, onClose, onDataUpdated }: CustomAmountProps) {
    const [size, setSize] = useState(0);


    async function saveCustomAmount() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        try {

            await db.runAsync(
                `INSERT INTO records (hydration) VALUES (?);`,
                [size]
            );
            console.log('Custom Amount Saved');
            onDataUpdated();
        } catch (error) {
            console.error("Custom Amount Failed", error);
        }
        onClose();
    }

    return (
        <Modal visible={visible} onRequestClose={onClose} transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <NumberInput
                        trailingText={'fl oz'}
                        textFieldProps={{ style: styles.text }}
                        trailingTextStyle={styles.text}
                        onChangeNumber={(sizeValue) => setSize(Number(sizeValue.userInput))}
                        fractionDigits={0}
                    />
                    <Button title={'Save Custom Amount'} onPress={saveCustomAmount} />
                    <Button title={'Cancel'} onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '60%',
        height: '30%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
