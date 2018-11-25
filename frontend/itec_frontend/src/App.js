import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminPanel from "./components/Admin/AdminPanel";
import Quiz from "./components/User/Quiz/Quiz";
import Home from "./components/User/Home/Home";
import Login from "./components/User/Login/Login";
import "./App.css";
import Verify from "./components/User/Verify";
import axios from "./utils/axios";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            isAdmin: false
        };
    }
    componentWillMount() {
        console.log("app mounted");
        axios
            .get("/user/me")
            .then(resp => {
                console.log(resp);
                this.setState({ isLoggedIn: true });
                if (resp.data.role == 1) {
                    this.setState({ isAdmin: true });
                }
            })
            .catch(err => {});
    }
    render() {
        return (
            <div className="App">
                <Router>
                    <div>
                        <Route path="/login" exact initial component={Login} />
                        {this.state.isAdmin && <Route path="/admin" component={AdminPanel} />}
                        <Route path="/" component={Home} exact />
                        <Route path="/quiz/:id" component={Quiz} exact />
                        <Route path="/activate/:hash" exact component={Verify} />
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
