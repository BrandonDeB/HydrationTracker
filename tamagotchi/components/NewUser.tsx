import { Text, RadioGroup, RadioButton, TextField } from 'react-native-ui-lib';
import {Component} from "react";
import { ThemedView } from '@/components/ThemedView';
import {StyleSheet} from "react-native";
import {ThemedText} from "@/components/ThemedText";

export default class NewUser extends Component {

    constructor(props: {}) {
        super(props);

        this.state = {
            name: undefined,
            gender: undefined
        };
    }

    render() {

        return (
            <>
                <ThemedView style={styles.content}>
                    <ThemedText style={styles.text}>👋</ThemedText>
                    <TextField placeholder={'Input Name'}  onChangeText={(value: any) => this.setState({name: value})}/>
                    <RadioGroup initialValue={"Unspecified"} onValueChange={(value: any) => this.setState({gender: value})}>
                        <Text marginB-20 text60 $textDefault>
                            Gender{'\n'}
                        </Text>
                        <RadioButton value={"Male"} label={"Male"}/>
                        <RadioButton value={"Female"} label={"Female"}/>
                        <RadioButton value={"Unspecified"} label={"Unspecified"}/>
                    </RadioGroup>
                </ThemedView>
            </>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
    },
    container: {
        flex: 1,
    },
    header: {
        height: 250,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        padding: 32,
        gap: 16,
        overflow: 'hidden',
    },
});