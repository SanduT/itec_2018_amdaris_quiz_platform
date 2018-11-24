import React from "react";
// import { connect } from "react-redux";
import axios from "../../utils/axios";
import "./Verify.css";
import wizzard from "../../assets/wizzard.png";
import badwizzard from "../../assets/bad_wizzard.png";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";
import { primary } from "../../styles/colors";
export class Vefify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goodWizzard: null,
            buttonText: ""
        };
    }

    componentWillMount() {
        axios
            .post("/user/verify", { hash: this.props.match.params.hash })
            .then(() => {
                //add success notif
                this.setState({ goodWizzard: true, buttonText: "Expecto patronum!" });
            })
            .catch(err => {
                this.setState({
                    goodWizzard: false,
                    buttonText: "Go to register page"
                });
            });
    }

    goToLogin() {
        this.props.history.push("/login");
    }
    render() {
        // const { hash } = this.props.match.params;
        //congratulations page
        return (
            <div className="verifyPageContainer">
                <div className="congratulationsContainer">
                    {this.state.goodWizzard ? (
                        <p>
                            Greetings, young wizzard! You stepped out of the muggle world and decided to join us! Now
                            it's time for you to use your first spell to go to the login page.
                        </p>
                    ) : (
                        <p>
                            You did not receive your acceptance letter! Please be patient for it to come to you, casting
                            mysterios links will not do any good.
                        </p>
                    )}
                    <Button
                        size="large"
                        variant="contained"
                        style={{ backgroundColor: primary, color: "white", width: 250 }}
                        onClick={() => this.goToLogin()}
                    >
                        {this.state.buttonText}
                    </Button>
                </div>
                <img alt="wizzard" src={this.state.goodWizzard ? wizzard : badwizzard} />
            </div>
        );
    }
}

export default Vefify;
