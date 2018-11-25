import React, { Component } from "react";
import Logo from "../../reusables/logo";
import { primary } from "../../../styles/colors";
import "./Profile.css";
import axios from "../../../utils/axios";
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = { leaderboard: [], id: "" };
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

    componentWillMount() {
        axios
            .get("user/leaderboard")
            .then(resp => this.setState({ leaderboard: resp.data }))
            .catch(err => console.log(err));

        axios
            .get("user/me")
            .then(resp => {
                console.log(resp);
                this.setState({ id: resp.data._id });
            })
            .catch(err => console.log(err));
    }

    goToLeaderBoard(link) {
        this.props.history.push("https://quizzard.club/api/quiz/leaderboard/" + link);
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
                <div className="profilePageContainer">
                    <p style={{ textAlign: "left" }}>Quizzes I Participated in:</p>
                    <div className="quizScoreContainer" style={{ textAlign: "left" }}>
                        {this.state.leaderboard.map(ld => {
                            return ld.map(user => {
                                return user.userId == this.state.id ? (
                                    <div onClick={() => this.goToLeaderBoard(user.quizId)} className="userScore">
                                        <p className="quizTitle">{user.quizTitle}</p>
                                        <p className="quizScore">Score : {user.score}</p>
                                    </div>
                                ) : null;
                            });
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
export default Profile;
