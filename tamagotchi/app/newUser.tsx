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
import GenderDropdown from "@/components/genderDropdown";
import {NumberInput} from "react-native-ui-lib";

export default function NewUser() {
    type FrogColor = "green" | "blue" | "red";

    const navigation = useNavigation();

    const [selectedColor, setSelectedColor] = useState<FrogColor>("green");
    const [name, setName] = useState("");
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [gender, setGender] = useState("");
    const [frogName, setFrogName] = useState("");

    async function submitPress() {
        const db = await SQLite.openDatabaseAsync('hydration.db');
        const existing_name = await db.getFirstAsync('SELECT name FROM user');
        if (existing_name == null) {
            console.log(existing_name);
        }
        await db.runAsync(
            `UPDATE user SET name=?, height=?, weight=?, gender=?, frogName=?, frogColor=?;`,
            [name, height, weight, "m", frogName, selectedColor]
        ).catch(function () {
            console.log("Preference Promise Rejected");
        });
        router.replace("/(tabs)");

    }

    const frogImage: { [key in FrogColor]: any } = {
        green: require('../assets/drawings/frog1.jpg'),
        blue: require('../assets/drawings/frog2.jpg'),
        red: require('../assets/drawings/frog3.jpg'),
    };

    const handleColorChange = (color: FrogColor) => {
        setSelectedColor(color);
    };

    return (

        <ScrollView>
                <View style={styles.idContainer}>
                    <Text style={styles.infoText}>Frog Info</Text>
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
                            onChangeText={(value: any) => setFrogName(value)}
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
                    </View>
                </View>

                <View style={styles.ownerContainer}>

                    <Text style={styles.infoText}>Owner Info</Text>
                    <TextInput
                        style={styles.inputOwner}
                        mode="outlined"
                        label="Owner's Name:"
                        placeholder="type yo name"
                        right={<TextInput.Affix />}
                        onChangeText={(value: any) => setName(value)}
                    />
                    <GenderDropdown/>

                    <View style={styles.row}>
                        <TextInput
                            style={styles.input}
                            mode="outlined"
                            placeholder="Weight in lbs"
                            keyboardType="number-pad"
                            returnKeyType="done"
                            onChangeText={text => setWeight(Number(text))}
                        />
                        <TextInput
                            style={styles.input}
                            mode="outlined"
                            placeholder="Height in inches"
                            keyboardType="number-pad"
                            returnKeyType="done"
                            onChangeText={text => setHeight(Number(text))}
                        />

                    </View>

                </View>
            <View style={styles.submitContainer}>
                <Button title="Submit" onPress={submitPress} color= "white" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        height: "auto",
    },
    ownerContainer: {
        backgroundColor: 'white',
        borderColor: '#5FC1FF',
        borderWidth: 5,
        borderRadius: 20,
        width: '90%',
        height: '45%',
        margin: 20
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        alignItems: 'center',
    },
    input: {
        fontSize: 16,
        width: '48%',
    },
    infoText: {
        fontSize: 30,
        alignSelf: 'center',
        padding: '5%',
        fontFamily: 'Jua',
    },
    buttonsContainer: {
        top: '-20%',
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
        borderColor: '#5FC1FF',
        borderWidth: 5,
        borderRadius: 20,
        width: '90%',
        height: '40%',
        margin: 20,
    },
    imageContainer: {
        alignItems: 'flex-start',
    },
    frogImage: {
        marginHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        width: 100,
        height: 100,
        marginLeft: '10%',
        borderColor: 'grey',
    },
    frogOptions: {
        alignSelf: 'flex-end',
        top: "-30%",
        marginRight: "10%",
        flexDirection: 'row',
        borderRadius: 20,
    },
    inputOwner: {
        width: '80%',
        alignSelf: 'center',
    },
    idHolder: {
        width: '8%',
        borderRadius: 5,
        backgroundColor: '#5FC1FF',
        top: '15.5%',
    },
    ownerInfo: {
        width: '100%',
        height: '80%',
        alignItems: 'center',
    },

    submitContainer:
        {
            borderRadius: 20,
            backgroundColor: '#5FC1FF',
            width: '80%',
            alignSelf: 'center',
        }

});
