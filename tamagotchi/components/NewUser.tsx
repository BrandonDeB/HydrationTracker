import {Text, RadioGroup, RadioButton, TextField, WheelPicker, WheelPickerProps} from 'react-native-ui-lib';
import {Component, useMemo} from "react";
import { ThemedView } from '@/components/ThemedView';
import {StyleSheet} from "react-native";
import {ThemedText} from "@/components/ThemedText";

export default class NewUser extends Component {

    constructor(props: {}) {
        super(props);

        this.state = {
            name: undefined,
            gender: undefined,
            feet: undefined,
            inches: undefined,
        };
    }

    render() {

        const FEETCONST = [...Array(8).keys()];
        const INCHESCONST = [...Array(12).keys()];

        const feetMap = FEETCONST.map(item => ({label: item.toString(), value: item}));
        const inchesMap = INCHESCONST.map(item => ({label: item.toString(), value: item}));

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
                    <WheelPicker  items={feetMap}  initialValue={0}  onChange={(value: any) => this.setState({feet: value})}/>
                    <WheelPicker  items={inchesMap}  initialValue={0}  onChange={(value: any) => this.setState({inches: value})}/>
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