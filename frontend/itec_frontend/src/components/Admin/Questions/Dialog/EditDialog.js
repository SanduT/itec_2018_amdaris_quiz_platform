import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
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
import "./Dialog.css";

const styles = theme => ({
    button: {
        display: "block",
        marginTop: theme.spacing.unit * 2
    },
    formControl: {
        margin: theme.spacing.unit,
        width: "calc(100% - 100px)",
        borderRadius: 5
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
    }
});

class EditDialog extends React.Component {
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
            answers: []
        };
        this.uploadImageRef = React.createRef();
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if (nextProps.questionToEdit !== null) {
            let q = nextProps.questionToEdit;
            console.log(q);
            this.setState({
                scored: q.scored,
                multipleChoice: q.multiple_answer,
                singleChoice: !q.free_text || q.multiple_answer,
                simpleAnswer: q.free_text,
                image: "",
                title: q.text,
                difficulty: q.difficulty_level,
                category: q.categoryId,
                choices: q.choices,
                answers: q.right_answers
            });
        }
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
        let newAnswers = this.state.answers;

        let index = newAnswers.indexOf(i);
        console.log(index);
        if (index > -1) {
            newAnswers.splice(index, 1);
        }

        for (let c = 0; c < newAnswers.length; c++) {
            if (newAnswers[c] > index) {
                newAnswers[c]--;
            }
        }

        console.log(this.state.answers);
        console.log(this.state.choices);
        console.log(i);

        let newChoices = this.state.choices;
        newChoices.splice(i, 1);

        this.setState({ answers: newAnswers, choices: newChoices });
    }

    renderChoices() {
        const { classes } = this.props;

        if (!this.state.multipleChoice) {
            return this.state.choices.map((choice, index) => {
                return (
                    <div style={{ display: "flex", width: "calc(100% - 100px)", marginLeft: "50px" }}>
                        <Radio
                            style={{ width: 30, height: 30, padding: 0, marginTop: 25, marginRight: 15 }}
                            checked={this.state.answers[0] === index}
                            onChange={e => this.handleChangeRadio(e, index)}
                            value="a"
                            name="radio-button-demo"
                            aria-label="A"
                        />
                        <TextField
                            id="standard-name"
                            label={"Choice" + (index + 1)}
                            className={classes.textField}
                            value={choice}
                            onChange={e => this.changeChoice(e, index)}
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
                );
            });
        } else {
            return this.state.choices.map((choice, index) => {
                return (
                    <div style={{ display: "flex", width: "calc(100% - 100px)", marginLeft: "50px" }}>
                        <Checkbox
                            style={{ width: 30, height: 30, padding: 0, marginTop: 25, marginRight: 15 }}
                            checked={this.state.answers.includes(index)}
                            onChange={e => this.handleChangeCheckbox(e, index)}
                            value="a"
                        />
                        <TextField
                            id="standard-name"
                            label={"Choice" + (index + 1)}
                            className={classes.textField}
                            value={choice}
                            onChange={e => this.changeChoice(e, index)}
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
                );
            });
        }
    }

    delete() {
        axios
            .delete("/question/" + this.props.questionToEdit._id)
            .then(resp => this.props.getCategories())
            .catch(err => console.log(err));

        this.resetAll();
    }

    submitForm() {
        axios
            .put("/question/" + this.props.questionToEdit._id, {
                text: this.state.title,
                categoryId: this.state.category,
                choices: this.state.choices,
                right_answers: this.state.answers,
                score: this.state.difficulty,
                difficulty_level: this.state.difficulty
            })
            .then(resp => this.props.getCategories())
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

    setDifficulty(val) {
        this.setState({ difficulty: val });
    }

    renderQuestion() {
        const { classes } = this.props;

        return (
            <div className="questionContainer">
                <div onClick={() => this.uploadImage()} className="photoContainer">
                    <Camera className={classes.camera} />
                    <input style={{ display: "none" }} ref={this.uploadImageRef} type="file" onChange={this.onChange} />
                </div>
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
                    label="Choices"
                />

                <br />

                <TextField
                    id="standard-name"
                    label="Question"
                    className={classes.textField}
                    value={this.state.title}
                    onChange={this.handleChangeTitle("title")}
                    margin="normal"
                />

                {/* <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="age-simple">Category</InputLabel>
                    <Select
                        className={classes.select}
                        value={this.state.age}
                        onChange={this.handleChangeTitle("category")}
                        inputProps={{
                            name: "age",
                            id: "age-simple"
                        }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {this.renderCategories()}
                    </Select>
                </FormControl> */}

                {this.state.scored && (
                    <DifficultySlider
                        initialDifficulty={this.state.difficulty}
                        setDifficulty={val => this.setDifficulty(val)}
                    />
                )}

                {this.state.singleChoice && (
                    <div className="choices">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    classes={{
                                        root: classes.root,
                                        checked: classes.checked
                                    }}
                                    checked={this.state.multipleChoice}
                                    onChange={this.handleChange("multipleChoice")}
                                    value="this.state.multipleChoice"
                                />
                            }
                            label="Multiple choice"
                        />
                        {this.renderChoices()}
                        <Add style={{ fontSize: "35px", marginTop: 10 }} onClick={() => this.addNewChoice()} />
                    </div>
                )}
            </div>
        );
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
                            <Button
                                variant="contained"
                                style={{ backgroundColor: "red", color: "white" }}
                                onClick={() => this.delete()}
                                autoFocus
                            >
                                Delete
                            </Button>
                        </DialogActions>
                    </div>
                </Dialog>
            </div>
        );
    }
}
EditDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    fullScreen: PropTypes.bool.isRequired
};

export default withMobileDialog()(withStyles(styles)(EditDialog));
