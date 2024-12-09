import React, { useState } from 'react';
import { View, TextInput, Button, Modal, StyleSheet } from 'react-native';

interface AddBottleProps {
    visible: boolean;
    onClose: () => void;
    onSave: (size: number) => void;
}

const AddBottle: React.FC<AddBottleProps> = ({ visible, onClose, onSave }) => {
    const [size, setSize] = useState(0);

    const handleSave = () => {
        if (size > 0) {
            onSave(size);
            setSize(0);
            onClose();
        }
    };

    return (
        <Modal visible={visible} onRequestClose={onClose} transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter bottle size"
                        keyboardType="numeric"
                        value={String(size)}
                        onChangeText={(text) => setSize(Number(text))}
                    />
                    <Button title="Save Bottle" onPress={handleSave} />
                    <Button title="Cancel" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalContent: {
        width: 200,
        height: 200,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        height: 40,
        backgroundColor: 'white',
        marginBottom: 20,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10, 
    },
});

export default AddBottle;
