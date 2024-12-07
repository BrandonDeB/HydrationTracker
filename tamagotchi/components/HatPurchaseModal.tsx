import React, {useEffect, useState} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Image} from 'react-native';

export const HatPurchaseModal: React.FC<{
    isVisible: boolean;
    hat: {hatId: number, price: number, name: string, filePath: string, purchased: boolean};
    onClose: () => void;
    onSelect: (hat: {hatId: number, price: number, name: string, filePath: string, purchased: boolean}) => void;
}> = ({ isVisible, onClose, onSelect, hat}) => {

    const images = require.context('../assets/drawings', true);

    const [clothingItems, setClothingItems] = useState<any[]>([]);

    useEffect(() => {
        console.log(hat.filePath);
    }, []);

    return (
        <Modal visible={isVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Purchase</Text>
                    <Image style={styles.image} source={images('./' + hat.filePath)} />
                    <View style={styles.price}>
                        <Text style={styles.priceText}>{"For " + hat.price}</Text>
                        <Image style={styles.gold} source={images('./gold.png')} />
                        <Text style={styles.priceText}>{"?"}</Text>
                    </View>
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            onPress={() => onSelect(hat)}
                            style={styles.addButton}
                        >
                            <Text style={styles.addButtonText}>Purchase</Text>
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
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    image: {
        width: '70%',
        height: '50%',
        alignSelf: "center"
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    contentContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
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
    title: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 16,
    },
    addButton: {
        backgroundColor: '#94D98B',
        paddingVertical: 16,
        borderRadius: 8,
        marginTop: 16,
        marginBottom: 8,
        marginHorizontal: 16,
        width: "40%"
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
    addButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    gold: {
        top: 5,
        height: 30,
        width: 30,
        resizeMode: "contain",
    },
    price: {
        flexDirection: "row",
        alignSelf: "center"
    },
    priceText: {
        height: 40,
        lineHeight: 40,
        fontSize: 24,
        textAlign: 'center',
        fontFamily: "Jua"
    }
});
