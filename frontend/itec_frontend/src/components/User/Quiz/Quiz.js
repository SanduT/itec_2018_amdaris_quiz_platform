import React, { Component } from "react";
// import { connect } from 'react-redux'
import axios from "../../../utils/axios";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { primary } from "../../../styles/colors";
import "./Quiz.css";
import { Button } from "@material-ui/core";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

const styles = theme => ({
    container: {
        display: "flex",
        flexWrap: "wrap"
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: "80%"
    },
    dense: {
        marginTop: 19
    },
    menu: {
        width: 200
    },
    formControl: {
        textAlign: "left",
        width: "80%",
        marginTop: 32
    }
});

class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogged: false,
            questions: [],
            baseQuestions: []
        };
    }
    componentWillMount() {
        axios
            .get("/user/me")
            .then(resp => {
                console.log(resp);
                this.setState({ isLogged: true });
            })
            .catch(err => this.props.history.push("/login"));

        axios.get("/question").then(resp => {
            console.log(resp.data);
            this.setState({ questions: resp.data });
            let baseQuestions = [];

            for (let q of resp.data) {
                if (q.free_text) {
                    baseQuestions.push({
                        text: q.text,
                        answer: "",
                        questionId: q._id
                    });
                } else {
                    baseQuestions.push({
                        text: q.text,
                        right_answer: "",
                        questionId: q._id,
                        answers: []
                    });
                }
            }

            console.log(baseQuestions);
            this.setState({ baseQuestions: baseQuestions });
        });
    }

    handleChange = index => event => {
        let newBaseQuestions = this.state.baseQuestions;

        newBaseQuestions[index].answer = event.target.value;
        this.setState({
            baseQuestions: newBaseQuestions
        });
    };

    renderSimpleAnswerQuestion(question, index) {
        const { classes } = this.props;

        return (
            <div>
                <TextField
                    id="standard-name"
                    label={question.text}
                    className={classes.textField}
                    value={this.state.baseQuestions[index].answer}
                    onChange={this.handleChange(index)}
                    margin="normal"
                />
            </div>
        );
    }

    renderMultipleChoiceQuestion(question, index) {
        const { classes } = this.props;

        return (
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">{question.text}</FormLabel>
                <FormGroup>
                    {question.choices.map((choice, choiceIndex) => {
                        return (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.baseQuestions[index].answers.includes(choiceIndex)}
                                        onChange={this.handleChangeCheckbox(index, choiceIndex)}
                                        value="gilad"
                                    />
                                }
                                label={choice}
                            />
                        );
                    })}
                </FormGroup>
            </FormControl>
        );
    }

    handleChangeRadio = (index, choiceIndex) => event => {
        console.log(index, choiceIndex);
        let newBaseQuestions = this.state.baseQuestions;
        console.log(newBaseQuestions);
        newBaseQuestions[index].answers[0] = choiceIndex;

        this.setState({ baseQuestions: newBaseQuestions });
    };

    handleChangeCheckbox = (index, choiceIndex) => event => {
        let newBaseQuestions = this.state.baseQuestions;

        if (event.target.checked) {
            newBaseQuestions[index].answers.push(choiceIndex);
        } else {
            let index2 = newBaseQuestions[index].answers.indexOf(choiceIndex);
            if (index2 > -1) {
                newBaseQuestions[index].answers.splice(index2, 1);
            }
        }

        this.setState({ baseQuestions: newBaseQuestions });
    };

    renderSingleChoiceQuestion(question, index) {
        const { classes } = this.props;
        return (
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">{question.text}</FormLabel>

                {question.choices.map((choice, choiceIndex) => {
                    return (
                        <div style={{ display: "flex", width: "calc(100% )" }}>
                            <Radio
                                style={{ width: 30, height: 30, padding: 0, marginTop: 25, marginRight: 15 }}
                                checked={this.state.baseQuestions[index].answers[0] === choiceIndex}
                                onChange={this.handleChangeRadio(index, choiceIndex)}
                                value="a"
                                name="radio-button-demo"
                                aria-label="A"
                            />
                            <p
                                style={{
                                    marginTop: 28,
                                    marginBottom: 0
                                }}
                            >
                                {choice}
                            </p>
                        </div>
                    );
                })}
            </FormControl>
        );
    }

    renderQuestion(question, index) {
        if (question.free_text) {
            return this.renderSimpleAnswerQuestion(question, index);
        } else if (question.multiple_answer) {
            return this.renderMultipleChoiceQuestion(question, index);
        } else return this.renderSingleChoiceQuestion(question, index);
    }

    renderForm() {
        return this.state.questions.map((question, index) => {
            return this.renderQuestion(question, index);
        });
    }

    submitForm() {
        let processedQuestions = [];

        for (let i in this.state.baseQuestions) {
            let newQuestion;
            if (this.state.questions[i].free_text) {
                // baseQuestions.push({
                //     text: q.text,
                //     answer: "",
                //     questionId: q._id
                // });

                newQuestion = {
                    answer: this.state.baseQuestions[i].answer,
                    questionId: this.state.questions[i]._id
                };

                processedQuestions.push(newQuestion);
            } else if (this.state.questions[i].multiple_answer) {
                let correctAnswers = this.state.questions[i].right_answers.sort();
                let actualAnswers = this.state.baseQuestions[i].answers.sort();

                if (correctAnswers.length !== actualAnswers.length) {
                    newQuestion = {
                        right_answer: false,
                        questionId: this.state.questions[i]._id
                    };
                } else {
                    let areEqual = true;
                    for (let j in correctAnswers) {
                        if (correctAnswers[j] != actualAnswers[j]) {
                            areEqual = false;
                            break;
                        }
                    }
                    if (areEqual) {
                        newQuestion = {
                            right_answer: true,
                            questionId: this.state.questions[i]._id
                        };
                    } else {
                        newQuestion = {
                            right_answer: false,
                            questionId: this.state.questions[i]._id
                        };
                    }
                }
                processedQuestions.push(newQuestion);
                // baseQuestions.push({
                //     text: q.text,
                //     right_answer: "",
                //     questionId: q._id,
                //     answers: []
                // });
            } else {
                let correctAnswers = this.state.questions[i].right_answers[0];
                let actualAnswers = this.state.baseQuestions[i].answers[0];
                if (correctAnswers == actualAnswers) {
                    newQuestion = {
                        right_answer: true,
                        questionId: this.state.questions[i]._id
                    };
                } else {
                    newQuestion = {
                        right_answer: false,
                        questionId: this.state.questions[i]._id
                    };
                }
                processedQuestions.push(newQuestion);
            }
        }

        console.log(processedQuestions);
    }

    render() {
        return (
            <div>
                {this.state.isLogged && (
                    <div>
                        <div style={{ backgroundColor: primary }} className="toolbarExtensionQuiz" />
                        <div className="formContainer">
                            <p className="quizTitle"> Quiz Title</p>
                            {this.state.baseQuestions.length > 0 && this.renderForm()}

                            <Button
                                variant="contained"
                                style={{ backgroundColor: primary, color: "white", margin: 32 }}
                                onClick={() => this.submitForm()}
                            >
                                Submit Form
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
export default withStyles(styles)(Quiz);
