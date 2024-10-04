import { Text, RadioGroup, RadioButton } from 'react-native-ui-lib';
import {Component} from "react";

export default class Charts extends Component {

    constructor(props: {}) {
        super(props);

        this.state = {
            color: undefined,
            messageType: undefined,
            disabledSelectedValue: true
        };
    }

    render() {
        return (
            <>
                <RadioGroup initialValue={"Unspecified"} onValueChange={(value: any) => this.setState({gender: value})}>
                    <Text marginB-20 text60 $textDefault>
                        Gender{'\n'}
                    </Text>
                    <RadioButton value={"Male"} label={"Male"}/>
                    <RadioButton value={"Female"} label={"Female"}/>
                    <RadioButton value={"Unspecified"} label={"Unspecified"}/>
                </RadioGroup>
            </>
        )
    }
}