import {StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Button} from 'react-native';
import React, { useState } from 'react';
import HydrationBar from "@/components/HydrationBar";
import { ThemedView } from "@/components/ThemedView";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {router, useNavigation} from "expo-router";
import * as SQLite from "expo-sqlite";
import { TextInput } from 'react-native-paper';
import ColorDropdown from "@/components/colorDropDown";
import OwnerInfo from "@/components/ownerInfo";

export default function NewUser() {
    type FrogColor = "green" | "blue" | "red";

    const navigation = useNavigation();

    const [text, setChangeText] = React.useState('');
    const [number, onChangeNumber] = React.useState('');
    const [selectedColor, setSelectedColor] = useState<FrogColor>("green");
    const [name, setName] = useState("");
    const [feet, setFeet] = useState(0);
    const [weight, setWeight] = useState(0);
    const [gender, setGender] = useState("");
    const [coins, setCoins] = useState(0);
    const [inches, setInches] = useState(0);

    async function submitPress() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const existing_name = await db.getFirstAsync('SELECT name FROM user');
        if (existing_name == null) {
            console.log(existing_name);
        }
        await db.runAsync(
            `UPDATE user SET name=?, height=?, weight=?, gender=?;`,
            [name, feet*12+inches, weight, gender]
        ).catch(function () {
            console.log("Preference Promise Rejected");
        });
        router.replace("/(tabs)");

    }

    const frogImage: { [key in FrogColor]: any } = {
        green: require('@/drawings/frog1.jpg'),
        blue: require('@/drawings/frog2.jpg'),
        red: require('@/drawings/frog3.jpg'),
    };

    const handleColorChange = (color: FrogColor) => {
        setSelectedColor(color);
    };

    const handleSelect = (value: string | null) => {
        console.log('Selected Value:', value);
    };

    return (

        <ScrollView style={{ flex: 1 }}>

            <View style={styles.container}>
                <View style={styles.idHolder}></View>
                <View style={styles.idContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={frogImage[selectedColor]}
                            style={styles.frogImage}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.frogOptions}>
                        <TextInput
                            style={styles.input}
                            mode="outlined"
                            label="Name:"
                            placeholder="name frog"
                            right={<TextInput.Affix />}
                        />
                    </View>

                    <View style={styles.buttonsContainer}>
                        <ColorDropdown
                            onSelect={(value) => {
                                if (value === "green") handleColorChange("green");
                                else if (value === "blue") handleColorChange("blue");
                                else if (value === "red") handleColorChange("red");
                            }}
                        />

                        <TextInput
                            style={styles.inputOwner}
                            mode="outlined"
                            label="Owner's Name:"
                            placeholder="type yo name"
                            right={<TextInput.Affix />}
                            onChangeText={(value: any) => setName(value)}
                        />
                    </View>
                </View>

                <View style={styles.ownerInfo}>
                    <OwnerInfo />
                </View>

                {/* Hydration Goal Section at the Bottom */}
                <View style={styles.hydroGoal}>
                    <View style={styles.hydroCard}>
                        <TextInput
                            style={styles.hydro}
                            mode="outlined"
                            label="Hydration Goal"
                            placeholder="Enter your hydration goal"
                            right={<TextInput.Affix />}
                        />
                    </View>
                </View>
            </View>
            <Button title="Submit" onPress={submitPress} color="#841584" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: "row",
        alignSelf: "center",
        margin: 50,
        padding: 10,
        justifyContent: "space-between",
        backgroundColor: "rgba(76, 175, 80, 0.0)",
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonsContainer: {
        marginBottom: 20,
        top: '-10%',
    },
    button: {
        fontSize: 18,
        margin: 10,
        padding: 10,
        backgroundColor: '#5FC1FF',
        borderRadius: 5,
        color: 'white',
    },
    idContainer: {
        backgroundColor: 'white',
        marginTop: "25%",
        borderColor: '#5FC1FF',
        borderWidth: 5,
        borderRadius: 20,
        width: '90%',
        height: '45%',
    },
    imageContainer: {
        alignItems: 'flex-start',
    },
    frogImage: {
        marginLeft: '10%',
        marginTop: '10%',
        width: 100,
        height: 100,
    },
    frogOptions: {
        alignSelf: 'flex-end',
        top: "-30%",
        marginRight: "10%",
        flexDirection: 'row',
    },
    input: {
        marginLeft: '4%',
        fontSize: 16,
        width: '50%',
    },
    inputOwner: {
        width: '80%',
        alignSelf: 'center',
    },
    idHolder: {
        height: '5%',
        width: '8%',
        borderRadius: 5,
        backgroundColor: '#5FC1FF',
        top: '15.5%',
        zIndex: 999,
    },
    ownerInfo: {
        top: '-5%',
        width: '100%',
        height: '80%',
        alignItems: 'center',
    },
    hydroGoal: {
        position: 'absolute',
        bottom: '-20%', // Adjust the bottom spacing if needed
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hydroCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        borderColor: '#5FC1FF',
        borderWidth: 2,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    hydro: {
        fontSize: 16,
    },
});
