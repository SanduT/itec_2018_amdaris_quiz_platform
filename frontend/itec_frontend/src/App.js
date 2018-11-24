import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminPanel from "./components/Admin/AdminPanel";
import Quiz from "./components/User/Quiz/Quiz";
import Login from "./components/User/Login/Login";
import "./App.css";
import Verify from "./components/User/Verify";

class App extends Component {
    render() {
        return (
            <div className="App">
                <Router>
                    <div>
                        <Route path="/admin" exact component={AdminLogin} />
                        <Route path="/adminpanel" component={AdminPanel} />
                        <Route path="/quiz" component={Quiz} />
                        <Route path="/login" initial component={Login} />
                        <Route path="/activate/:hash" component={Verify} />
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
