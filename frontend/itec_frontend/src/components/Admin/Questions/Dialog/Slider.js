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
        if (value !== 0) this.props.setDifficulty(value / 10);
        else this.props.setDifficulty(value);
    }
    render() {
        return (
            <div>
                <div style={style}>
                    <p style={{ textAlign: "left", color: "grey" }}>Difficulty</p>
                    <Slider min={0} marks={marks} step={null} onChange={e => this.log(e)} defaultValue={2} />
                </div>
            </div>
        );
    }
}
export default DifficultySlider;
