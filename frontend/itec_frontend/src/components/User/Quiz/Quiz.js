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
                        answers: [0]
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
                                        onChange={this.handleChangeRadio(index, choiceIndex)}
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

    // handleChangeRadio = (index, choiceIndex) => event => {
    //     let newBaseQuestions = this.state.baseQuestions;

    //     if (event.target.checked) {
    //         newBaseQuestions[index].answers = [choiceIndex];
    //     }
    // };

    handleChangeRadio = index => event => {
        let newBaseQuestions = this.state.baseQuestions;
        newBaseQuestions[index].answers = [event.target.value];

        this.setState({ baseQuestions: newBaseQuestions });
    };

    renderSingleChoiceQuestion(question, index) {
        const { classes } = this.props;
        return (
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">{question.text}</FormLabel>
                <RadioGroup
                    aria-label="Gender"
                    name="gender1"
                    className={classes.group}
                    value={this.state.baseQuestions[index].answers[0]}
                    onChange={this.handleChangeRadio(index)}
                >
                    {question.choices.map((choice, choiceIndex) => {
                        console.log(choiceIndex);
                        console.log(this.state.baseQuestions[index].answers[0]);
                        return <FormControlLabel value={choiceIndex} control={<Radio />} label={choice} />;
                    })}
                </RadioGroup>
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
