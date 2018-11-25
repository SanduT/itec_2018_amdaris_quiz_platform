import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import blue from "@material-ui/core/colors/blue";
import { Button } from "@material-ui/core";
import { primary } from "../../../../styles/colors";
const styles = theme => ({
    button: {
        display: "block",
        marginTop: theme.spacing.unit * 2
    },
    formControl: {
        margin: theme.spacing.unit,
        width: "calc(100% - 32px)",
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
    }
});

class SortBy extends React.Component {
    state = {
        age: "",
        open: false,
        scored: false,
        multipleChoice: false,
        singleChoice: false,
        simpleAnswer: false,
        hasImage: false,
        filterBy: ""
    };

    handleChange = name => event => {
        if (event.target.checked) {
            this.setState({ filterBy: name });
        }
    };

    handleChangeSort = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    applyFilters() {
        this.props.applyFilters(this.state.filterBy, this.state.age);
    }

    sortBy() {
        this.props.sortBy(this.state.age);
    }

    render() {
        const { classes } = this.props;

        return (
            <form autoComplete="off">
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="demo-controlled-open-select">Sort by</InputLabel>
                    <Select
                        open={this.state.open}
                        onClose={this.handleClose}
                        onOpen={this.handleOpen}
                        value={this.state.age}
                        onChange={this.handleChangeSort}
                        inputProps={{
                            name: "age",
                            id: "age-simple"
                        }}
                        className={classes.select}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={"difficulty_level"}>Difficulty</MenuItem>
                        <MenuItem value={"score"}>Score</MenuItem>
                        <MenuItem value={"text"}>Name</MenuItem>
                    </Select>
                </FormControl>

                <FormControl style={{ marginTop: "32px" }} component="fieldset" className={classes.formControl}>
                    <FormLabel style={{ textAlign: "left" }} component="legend">
                        Filter by
                    </FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    classes={{
                                        root: classes.root,
                                        checked: classes.checked
                                    }}
                                    checked={this.state.filterBy === "scored"}
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
                                    checked={this.state.filterBy === "multiple_answer"}
                                    onChange={this.handleChange("multiple_answer")}
                                    value="{this.state.multipleChoice}"
                                />
                            }
                            label="Multiple choice"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    classes={{
                                        root: classes.root,
                                        checked: classes.checked
                                    }}
                                    checked={this.state.filterBy === "single_answer"}
                                    onChange={this.handleChange("single_answer")}
                                    value="this.state.singleChoice"
                                />
                            }
                            label="Single Choice"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    classes={{
                                        root: classes.root,
                                        checked: classes.checked
                                    }}
                                    checked={this.state.filterBy === "free_text"}
                                    onChange={this.handleChange("free_text")}
                                    value="this.state.simpleAnswer"
                                />
                            }
                            label="Simple Answer"
                        />
                    </FormGroup>
                </FormControl>

                <Button
                    variant="contained"
                    style={{ backgroundColor: primary, color: "white" }}
                    onClick={() => this.applyFilters()}
                >
                    Apply Filters
                </Button>
            </form>
        );
    }
}

SortBy.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SortBy);
