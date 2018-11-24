import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import SingleQuestion from "../SingleQuestion/SingleQuestion";
import { FormControlLabel, Checkbox, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { primary } from "../../../../styles/colors";
import PropTypes from "prop-types";
import Camera from "@material-ui/icons/CameraAlt";
import Cancel from "@material-ui/icons/Cancel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Add from "@material-ui/icons/Add";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Input from "@material-ui/core/Input";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FilledInput from "@material-ui/core/FilledInput";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import DifficultySlider from "./Slider";
import axios from "../../../../utils/axios";
import SelectTyping from "react-select";
import "./Dialog.css";

const styles = theme => ({
    button: {
        display: "block",
        marginTop: theme.spacing.unit * 2
    },
    formControlSelect: {
        margin: theme.spacing.unit,
        width: "calc(100% - 116px)",
        borderRadius: 5,
        textAlign: "left",
        marginLeft: 50
    },
    formControl: {
        margin: theme.spacing.unit,
        width: "calc(100% - 100px)",
        borderRadius: 5,
        textAlign: "left"
    },
    formControlSmaller: {
        margin: theme.spacing.unit,
        width: "calc(100% - 180px)",
        marginLeft: 50,
        borderRadius: 5,
        textAlign: "left"
    },
    select: {
        width: "100%"
    },
    root: {
        color: primary,
        "&$checked": {
            color: primary
        }
    },
    checked: {
        color: primary,
        "&$checked": {
            color: primary
        }
    },
    camera: {
        fontSize: 44,
        margin: 13,
        color: "grey"
    },
    dialog: {
        margin: 0
    },
    textField: {
        width: "calc(100% - 100px)"
    },
    select: {
        // width: "calc(100% - 100px)"
    },
    paper: {
        margin: 0
    },
    scrollPaper: {
        margin: 0
    },
    scrollPaper: {
        margin: 0
    },
    textFieldMini: {
        width: 64,
        position: "relative",
        bottom: 7
    }
});

class AddDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            age: "",
            scored: false,
            multipleChoice: false,
            singleChoice: false,
            simpleAnswer: false,
            image: "",
            title: "",
            difficulty: 0,
            category: "",
            choices: [" "],
            answers: [],
            quizContent: []
        };
        this.uploadImageRef = React.createRef();
    }
    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
        if (name == "multipleChoice") {
            this.setState({ answers: [] });
        }
    };

    handleChangeTitle = name => event => {
        this.setState({ [name]: event.target.value });
    };

    uploadImage() {
        console.log(this.uploadImageRef);
        this.uploadImageRef.current.click();
    }

    onChange(e) {
        console.log(e.target.files);
    }

    changeChoice(event, index) {
        let newChoices = this.state.choices;

        newChoices[index] = event.target.value;

        this.setState({ choices: newChoices });
    }

    handleChangeRadio(e, i) {
        console.log(e, i);
        this.setState({ answers: [i] });
    }

    handleChangeCheckbox(e, i) {
        console.log(e.target.checked);
        console.log(e);
        let newAnswers = this.state.answers;
        if (e.target.checked) {
            newAnswers.push(i);
        } else {
            let index = newAnswers.indexOf(i);
            if (index > -1) {
                newAnswers.splice(index, 1);
            }
        }
        this.setState({ answers: newAnswers });
    }

    removeChoice(i) {
        console.log("called");
        let newAnswers = this.state.quizContent;

        newAnswers.splice(i, 1);

        console.log(newAnswers);

        this.setState({ quizContent: newAnswers });
    }

    submitForm() {
        axios
            .post("/quiz", {
                title: this.state.title,
                eventId: this.props.currentEvent._id,
                scored: this.state.scored,
                rules: this.state.quizContent
            })
            .then(resp => console.log(resp))
            .catch(err => console.log(err));

        this.resetAll();
    }

    resetAll() {
        this.setState({
            scored: false,
            multipleChoice: false,
            singleChoice: false,
            simpleAnswer: false,
            image: "",
            title: "",
            difficulty: 0,
            category: "",
            choices: [],
            answers: []
        });

        this.props.handleClose();
    }

    addNewChoice() {
        let newChoices = this.state.choices;

        newChoices.push("");
        this.setState({ choices: newChoices });
    }

    setDifficulty(val, index) {
        this.setState({ difficulty: val });

        let newContent = this.state.quizContent;

        newContent[index].difficulty_level = val;

        this.setState({ quizContent: newContent });
    }

    handleChangeQuiz(e, index) {
        let newContent = this.state.quizContent;

        newContent[index].id = e.target.value;

        this.setState({ quizContent: newContent });
    }

    handleChangeNumber(e, index) {
        let newContent = this.state.quizContent;

        newContent[index].no = e.target.value;

        this.setState({ quizContent: newContent });
    }

    renderQuizContent() {
        const { classes } = this.props;
        const options = [
            { value: "chocolate", label: "Chocolate" },
            { value: "strawberry", label: "Strawberry" },
            { value: "vanilla", label: "Vanilla" }
        ];

        return this.state.quizContent.map((quiz, index) => {
            return quiz.rule_type === "category" ? (
                <div>
                    <div style={{ display: "flex" }}>
                        <FormControl key={index} className={classes.formControlSmaller}>
                            <InputLabel htmlFor="age-simple">Category</InputLabel>
                            <Select
                                className={classes.select}
                                value={quiz.id}
                                onChange={e => this.handleChangeQuiz(e, index)}
                                inputProps={{
                                    name: "age",
                                    id: "age-simple"
                                }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="54">
                                    <em>Lalalarrrrrrrrrrrrr</em>
                                </MenuItem>
                                {this.renderCategories()}
                            </Select>
                        </FormControl>
                        <TextField
                            id="standard-name"
                            label="Number"
                            className={classes.textFieldMini}
                            value={quiz.no}
                            onChange={e => this.handleChangeNumber(e, index)}
                            margin="normal"
                        />
                        <Cancel
                            style={{
                                marginTop: 26,
                                marginLeft: 16,
                                color: "grey",
                                fontSize: 30
                            }}
                            onClick={() => this.removeChoice(index)}
                        />
                    </div>

                    {this.state.scored && <DifficultySlider setDifficulty={val => this.setDifficulty(val, index)} />}
                </div>
            ) : (
                <div>
                    <div style={{ display: "flex" }}>
                        <FormControl key={index} className={classes.formControlSelect}>
                            <InputLabel htmlFor="age-simple">Question</InputLabel>
                            <Select
                                className={classes.select}
                                value={quiz.id}
                                onChange={e => this.handleChangeQuiz(e, index)}
                                inputProps={{
                                    name: "age",
                                    id: "age-simple"
                                }}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="54">
                                    <em>Lalalarrrrrrrrrrrrr</em>
                                </MenuItem>
                                {this.renderQuestionOptions()}
                            </Select>
                            {/* <SelectTyping
                            value={quiz.id}
                            onChange={e => this.handleChangeQuiz(e, index)}
                            options={this.props.questionOptions}
                        /> */}

                            {/* {this.getQuestionOptions()} */}
                        </FormControl>
                        <Cancel
                            style={{
                                marginTop: 26,
                                marginLeft: 16,
                                color: "grey",
                                fontSize: 30
                            }}
                            onClick={() => this.removeChoice(index)}
                        />
                    </div>
                </div>
            );
        });
    }

    renderQuestion() {
        const { classes } = this.props;

        return (
            <div className="questionContainer">
                <br />
                <FormControlLabel
                    control={
                        <Checkbox
                            classes={{
                                root: classes.root,
                                checked: classes.checked
                            }}
                            checked={this.state.scored}
                            onChange={this.handleChange("scored")}
                            value="this.state.scored"
                        />
                    }
                    label="Scored"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            classes={{
                                root: classes.root,
                                checked: classes.checked
                            }}
                            checked={this.state.singleChoice}
                            onChange={this.handleChange("singleChoice")}
                            value="this.state.singleChoice"
                        />
                    }
                    label="Limited Time"
                />

                <br />

                <TextField
                    id="standard-name"
                    label="Quiz Title"
                    className={classes.textField}
                    value={this.state.title}
                    onChange={this.handleChangeTitle("title")}
                    margin="normal"
                />

                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                    <Button
                        onClick={() => this.addQuestionToQuiz()}
                        style={{ backgroundColor: primary, color: "white", marginTop: "10px" }}
                        variant="contained"
                    >
                        Add Specific Question
                    </Button>
                    <Button
                        onClick={() => this.addCategoryToQuiz()}
                        style={{ backgroundColor: primary, color: "white", marginLeft: "10px", marginTop: "10px" }}
                        variant="contained"
                    >
                        Add Category Questions
                    </Button>
                </div>

                {this.renderQuizContent()}

                {/* {this.state.scored && <DifficultySlider setDifficulty={val => this.setDifficulty(val)} />}
                 */}
            </div>
        );
    }

    addQuestionToQuiz() {
        axios.post("/quiz/verify", this.state.quizContent).then(() => {
            let newContent = this.state.quizContent;

            newContent.push({
                rule_type: "question",
                id: ""
            });
            this.setState({ quizContent: newContent });
        });
    }

    addCategoryToQuiz() {
        axios.post("/quiz/verify", this.state.quizContent).then(() => {
            let newContent = this.state.quizContent;

            newContent.push({
                rule_type: "category",
                id: "",
                no: 1,
                difficulty_level: 0
            });
            this.setState({ quizContent: newContent });
        });
    }

    renderQuestionOptions() {
        return this.props.questions.map(q => {
            return <MenuItem value={q._id}>{q.text}</MenuItem>;
        });
    }

    getQuestionOptions() {
        let options = [];

        for (let question of this.props.questions) {
            let op = {
                value: question._id,
                label: question.text
            };
            options.push(op);
        }
        console.log(options);

        return options;
    }

    renderCategories() {
        return this.props.categories.map(cat => {
            return <MenuItem value={cat.category._id}>{cat.category.title}</MenuItem>;
        });
    }
    render() {
        const { classes } = this.props;
        const { fullScreen } = this.props;
        return (
            <div>
                <Dialog
                    fullScreen={fullScreen}
                    className={classes.dialog}
                    open={this.props.open}
                    onClose={this.props.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    scroll={this.state.scroll}
                    maxWidth={"lg"}
                >
                    <div className="dialogContent">
                        <DialogTitle id="alert-dialog-title">{"Add new question"}</DialogTitle>
                        <DialogContent style={{ minWidth: "340px" }}>{this.renderQuestion()}</DialogContent>
                        <DialogActions>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: primary, color: "white" }}
                                onClick={() => this.submitForm()}
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: primary, color: "white" }}
                                onClick={() => this.resetAll()}
                                autoFocus
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </div>
                </Dialog>
            </div>
        );
    }
}
AddDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    fullScreen: PropTypes.bool.isRequired
};

export default withMobileDialog()(withStyles(styles)(AddDialog));
