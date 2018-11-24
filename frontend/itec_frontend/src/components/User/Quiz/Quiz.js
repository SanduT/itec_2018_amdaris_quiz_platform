import React, { Component } from "react";
// import { connect } from 'react-redux'
import axios from "../../../utils/axios";
class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogged: false
        };
    }
    componentWillMount() {
        console.log("app mounted");
        axios
            .get("/user/me")
            .then(resp => {
                console.log(resp);
                this.setState({ isLogged: true });
            })
            .catch(err => this.props.history.push("/login"));
    }

    render() {
        return <div>{this.state.isLogged && <div>Quiz</div>}</div>;
    }
}
export default Quiz;
