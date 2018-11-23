import React from "react";
// import { connect } from "react-redux";
import axios from "../../utils/axios";

export class Vefify extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        axios
            .post("/user/verify", { hash: this.props.match.params.hash })
            .then(() => {
                //add success notif
            })
            .catch(err => this.props.history.push("/login"));
    }

    render() {
        // const { hash } = this.props.match.params;
        //congratulations page
        return <div />;
    }
}

export default Vefify;
