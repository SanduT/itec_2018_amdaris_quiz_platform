import React from "react";
// import { connect } from "react-redux";
import axios from "axios";

export class Vefify extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        axios
            .post("/login/check_token", { hash: this.props.match.params.hash })
            .then(() => {})
            .catch(err => this.props.history.push("/login"));
    }

    render() {
        // const { hash } = this.props.match.params;
        return <div />;
    }
}

export default Vefify;
