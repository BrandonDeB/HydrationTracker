import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TextInput } from 'react-native-paper';
import ColorDropdown from "@/components/colorDropDown";
import GenderDropdown from "@/components/genderDropdown";

const OwnerInfo = () => {

    return (
        <View style={styles.container}>

            <Text style={styles.infoText}>Owner's Info</Text>

            <GenderDropdown/>

            <View style={styles.row}>
            <TextInput
                style={styles.input}
                mode="outlined"
                label="Weight (lbs)"
                placeholder=""
                right={<TextInput.Affix />}
            />
            <TextInput
                style={styles.input}
                mode="outlined"
                label="Height"
                placeholder="s"
                right={<TextInput.Affix />}
            />

            </View>

        </View>


    );
}

export default OwnerInfo;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginTop: "25%",
        borderColor: '#5FC1FF',
        borderWidth: 5,
        borderRadius: 20,
        width: '90%',
        height: '45%',
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
        width: '45%',
    },
    infoText: {
        fontSize: 30,
        alignSelf: 'center',
        paddingTop: '10%',
        paddingBottom: '5%',
    },


})