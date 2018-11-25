import React from "react";
// import { connect } from "react-redux";
import axios from "../../../utils/axios";
import "./Home.css";
import wizzard from "../../../assets/prezentation_wizzard.png";
import qrscanner from "../../../assets/qr_scanner.png";
import holdCard from "../../../assets/holdcard.png";
import wand from "../../../assets/magic-wand.png";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";
import { primary } from "../../../styles/colors";
import Logo from "../../reusables/logo";
export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // goodWizzard: null,
            // buttonText: ""
        };
        this.phone = React.createRef();
        this.card = React.createRef();
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

    scrollToPhone = () => {
        window.scrollTo({
            top: this.phone.current.offsetTop,
            behavior: "smooth"
        });
    };

    scrollToCard = () => {
        window.scrollTo({
            top: this.card.current.offsetTop,
            behavior: "smooth"
        });
    };

    render() {
        // const { hash } = this.props.match.params;
        //congratulations page
        return (
            <div className="presentationPage">
                <div className="homeToolbar" style={{ backgroundColor: primary }}>
                    <Logo onClick={() => this.goHome()} />
                    <div className="spacer" />

                    <div onClick={() => this.goToProfile()} className="logOut">
                        Profile
                    </div>

                    <div onClick={() => this.logOut()} className="logOut">
                        Log out
                    </div>
                </div>

                <div className="verifyPageContainerHome">
                    <div className="congratulationsContainerHome">
                        <p>
                            You came across the most magical quiz platform to ever be witnessed! Welcome! Join me for a
                            quick guide of mastering it.
                        </p>

                        <Button
                            size="large"
                            variant="contained"
                            style={{ backgroundColor: primary, color: "white", width: 250 }}
                            onClick={this.scrollToPhone}
                        >
                            Teach me master
                        </Button>
                    </div>
                    <img alt="wizzard" src={wizzard} />
                </div>

                <div className="QRcodeExplanation" ref={this.phone}>
                    <div className="congratulationsContainerHome">
                        <p>
                            It's as simple as riding your first broom! Except you don't need a broom, you need a...
                            phone!
                        </p>

                        <Button
                            size="large"
                            variant="contained"
                            style={{ backgroundColor: primary, color: "white", width: 250 }}
                            onClick={this.scrollToCard}
                        >
                            Tell me more
                        </Button>
                    </div>

                    <img src={qrscanner} />
                </div>

                <div className="holdCard" ref={this.card}>
                    <div className="congratulationsContainerHome">
                        <p>
                            All you need to do is use your prefered spell (..or mobile app) for scanning OR-codes to
                            contribute to your fellow wizzard friends' quizzez!
                        </p>

                        {/* <Button
                            size="large"
                            variant="contained"
                            style={{ backgroundColor: primary, color: "white", width: 250 }}
                        >
                            And then what?
                        </Button> */}
                    </div>

                    <img src={holdCard} />
                </div>
            </div>
        );
    }
}

export default Home;
