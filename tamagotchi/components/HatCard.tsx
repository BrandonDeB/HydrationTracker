import React, {useState} from "react";
import {TouchableOpacity, StyleSheet, Text, Image, View, Dimensions} from "react-native";
import {LinearGradient} from "expo-linear-gradient";


export default function HatCard(props: any) {

    const images = require.context('../assets/drawings', true);
    const windowWidth = Dimensions.get('window').width;
    const itemWidth = (windowWidth - 48) / 2;

    function cardPress() {
        console.log(props.id);
        props.onPress(props.id)
    }

    return (
            <TouchableOpacity key={props.id} style={[styles.card, {width: itemWidth}]} onPress={() => cardPress()}>
                {/*<LinearGradient*/}
                {/*    // Background Linear Gradient*/}
                {/*    colors={['rgba(95,193,255,1)', 'rgba(95,193,255,.2)']}*/}
                {/*    style={styles.background}*/}
                {/*/>*/}
                <Image style={styles.image} source={images('./' + props.image)} />
                <View style={styles.price}>
                    <Text style={styles.priceText}>{props.price}</Text>
                    <Image style={styles.gold} source={images('./gold.png')} />
                </View>
            </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        height: 200,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: '80%',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 300,
    },
    gold: {
        top: 5,
        height: 30,
        width: 30,
        resizeMode: "contain",
    },
    price: {
        flexDirection: "row",
        position: 'absolute',
        top: 0,
        left: 100,
        gap: 3
    },
    priceText: {
        height: 40,
        lineHeight: 40,
        fontSize: 24,
        textAlign: 'center',
        fontFamily: "Jua"
    }
})