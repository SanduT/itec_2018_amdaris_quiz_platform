import React, { Component } from "react";
import Logo from "../../reusables/logo";
import { primary } from "../../../styles/colors";
import "./Profile.css";
import axios from "../../../utils/axios";
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    goToLogin() {
        this.props.history.push("/login");
    }

    goToProfile() {
        this.props.history.push("/profile");
    }

    goHome() {
        this.props.history.push("/");
    }

    logOut() {
        axios.post("/user/logout").then(() => {
            this.goToLogin();
        });
    }

    render() {
        return (
            <div>
                <div className="homeToolbar" style={{ backgroundColor: primary }}>
                    <Logo onClick={() => this.goHome()} />
                    <div className="spacer" />

                    <div onClick={() => this.goHome()} className="logOut">
                        Home
                    </div>

                    <div onClick={() => this.logOut()} className="logOut">
                        Log out
                    </div>
                </div>
            </div>
        );
    }
}
export default Profile;
