import React, {useState} from "react";
import {TouchableOpacity, StyleSheet, ImageBackground, Text, Image, View} from "react-native";


export default function HatCard(props: any) {

    const images = require.context('../assets/drawings', true);

    function cardPress() {
        console.log(props.image);
    }

    return (
        <View>
            <TouchableOpacity key={props.id} style={styles.card} onPress={() => cardPress()}>
                <Text>{props.name}</Text>
                <Image style={styles.image} source={images('./' + props.image)} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {

    },
    image: {
        width: 100, // Adjust as needed
        height: 100, // Adjust as needed
        resizeMode: 'contain', // Ensures the image scales properly
    },
})