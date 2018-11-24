import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { primary } from "../../../styles/colors";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "../../../utils/axios";
import "./Login.css";
import "../../../styles/common.css";
var NotificationSystem = require("react-notification-system");
// import { connect } from 'react-redux'
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Login",
            email: "",
            password: "",
            isLogin: true,
            phone: "",
            name: ""
        };
        this._addNotification = this._addNotification.bind(this);
    }

    _addNotification(title, message, level) {
        this.refs.notificationSystem.addNotification({
            title: title,
            message: message,
            level: level,
            position: "br"
        });
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };
    switchLogin() {
        const currentState = this.state.isLogin;

        this.setState({
            isLogin: !currentState,
            name: "",
            password: "",
            phone: "",
            email: "",
            title: currentState === true ? "Sign Up" : "Login"
        });
    }

    validateEmail(email) {
        /*eslint-disable-next-line*/
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    submit() {
        if (this.state.isLogin) {
            if (this.state.email.length === 0 || this.state.password.length === 0) {
                this._addNotification("Error", "Complete all fields.", "error");
            } else if (!this.validateEmail(this.state.email)) {
                this._addNotification("Error", "Please use a valid email.", "error");
            } else
                axios
                    .post("/user/login", {
                        email: this.state.email,
                        password: this.state.password
                    })
                    .then(() => {
                        this._addNotification("GREAT", "GO CONQUER THE QUIZ WORLD!", "success");
                        setTimeout(() => {
                            this.props.history.push("/");
                        }, 500);
                    })
                    .catch(() => {
                        this._addNotification("Error", "Something went wrong.", "error");
                    });
        } else {
            if (
                this.state.email.length === 0 ||
                this.state.password.length === 0 ||
                this.state.phone.length === 0 ||
                this.state.name.length === 0
            ) {
                this._addNotification("Error", "Complete all fields.", "error");
            } else if (!this.validateEmail(this.state.email)) {
                this._addNotification("Error", "Please use a valid email.", "error");
            } else
                axios
                    .post("/user", {
                        email: this.state.email,
                        phone_nr: this.state.phone,
                        name: this.state.name,
                        password: this.state.password
                    })
                    .then(() => {
                        this._addNotification(
                            "Ok great!",
                            "You have been registered, check your mail for a validation email.",
                            "success"
                        );
                        this.switchLogin();
                    })
                    .catch(() => {
                        this._addNotification("Error", "An error ocurred", "error");
                    });
        }
    }

    renderLoginFields() {
        return (
            <div className="loginFieldsContainer">
                <TextField
                    id="standard-name"
                    label="Email"
                    //   className={classes.textField}
                    value={this.state.email}
                    onChange={this.handleChange("email")}
                    margin="normal"
                />
                <br />

                <TextField
                    id="standard-name"
                    label="Password"
                    //   className={classes.textField}
                    value={this.state.password}
                    type="password"
                    onChange={this.handleChange("password")}
                    margin="normal"
                />

                <br />

                <Button
                    style={{ backgroundColor: primary, color: "white" }}
                    variant="contained"
                    className="loginButton"
                    onClick={() => this.submit()}
                >
                    Primary
                </Button>

                <p className="loginText" onClick={() => this.switchLogin()}>
                    Already have an account?{" "}
                </p>
            </div>
        );
    }

    renderSignUpFields() {
        return (
            <div className="loginFieldsContainer">
                <TextField
                    id="standard-name"
                    label="Email"
                    //   className={classes.textField}
                    value={this.state.email}
                    onChange={this.handleChange("email")}
                    margin="normal"
                />
                <br />

                <TextField
                    id="standard-name"
                    label="Name"
                    //   className={classes.textField}
                    value={this.state.name}
                    onChange={this.handleChange("name")}
                    margin="normal"
                />

                <br />

                <TextField
                    id="standard-name"
                    label="Phone"
                    //   className={classes.textField}
                    value={this.state.phone}
                    onChange={this.handleChange("phone")}
                    margin="normal"
                />

                <br />

                <TextField
                    id="standard-name"
                    label="Password"
                    //   className={classes.textField}
                    value={this.state.password}
                    type="password"
                    onChange={this.handleChange("password")}
                    margin="normal"
                />

                <br />

                <Button
                    style={{ backgroundColor: primary, color: "white" }}
                    variant="contained"
                    className="loginButton"
                    onClick={() => this.submit()}
                >
                    Primary
                </Button>

                <p className="loginText" onClick={() => this.switchLogin()}>
                    Don't have an account?{" "}
                </p>
            </div>
        );
    }

    render() {
        return (
            <div className="loginContainer">
                <NotificationSystem ref="notificationSystem" />
                <AppBar position="static" style={{ backgroundColor: primary }}>
                    {console.log(primary)}
                    <Toolbar>
                        <Typography variant="h6" style={{ color: "white" }}>
                            {this.state.title}
                        </Typography>
                    </Toolbar>
                </AppBar>

                {this.state.isLogin ? this.renderLoginFields() : this.renderSignUpFields()}
            </div>
        );
    }
}
export default Login;
