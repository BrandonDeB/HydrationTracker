import React, { useState } from 'react';
import { View, TextInput, Button, Modal, StyleSheet } from 'react-native';
import {NumberInput} from "react-native-ui-lib";

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
                    <View style={styles.input}>
                    <NumberInput
                        trailingText={' fl oz'}
                        textFieldProps={{ style: styles.text }}
                        trailingTextStyle={styles.text}
                        onChangeNumber={(sizeValue) => setSize(Number(sizeValue.userInput))}
                        fractionDigits={0}
                    />
                    </View>
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
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
    }

});

export default AddBottle;
