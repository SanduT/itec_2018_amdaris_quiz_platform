import "rc-slider/assets/index.css";

import React, { Component } from "react";
import Slider from "rc-slider";

const style = { width: "calc(100% - 100px)", marginLeft: 50 };
const marks = {
    0: <strong>0</strong>,
    10: "1",
    20: "2",
    30: "3",
    40: "4",
    50: "5",
    60: "6",
    70: "7",
    80: "8",
    90: "9",
    100: {
        style: {
            color: "black"
        },
        label: <strong>10</strong>
    }
};
class DifficultySlider extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    log(value) {
        console.log(value);
        if (value[0] === value[1] && value[0] !== 0) {
            this.props.setDifficulty([value[0] / 10]);
        } else if (value[0] === value[1] && value[0] === 0) {
            this.props.setDifficulty([value[0]]);
        } else {
            let valueArray = [];
            for (let i = value[0]; i <= value[1]; i = i + 10) {
                if (i !== 0) valueArray.push(i / 10);
                else valueArray.push(i);
            }
            this.props.setDifficulty(valueArray);
        }
    }
    render() {
        return (
            <div>
                <div style={style}>
                    <p style={{ textAlign: "left", color: "grey" }}>Difficulty</p>
                    <Slider.Range min={0} marks={marks} step={10} onChange={e => this.log(e)} defaultValue={[0, 0]} />
                </div>
            </div>
        );
    }
}
export default DifficultySlider;
