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
        hasImage: false
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
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
                        <MenuItem value={10}>Difficulty</MenuItem>
                        <MenuItem value={20}>Score</MenuItem>
                        <MenuItem value={30}>Date</MenuItem>
                        <MenuItem value={40}>Name</MenuItem>
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
                                    checked={this.state.scored}
                                    onChange={this.handleChange("scored")}
                                    value="this.state.scored"
                                />
                            }
                            label="Antoine Llorca"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    classes={{
                                        root: classes.root,
                                        checked: classes.checked
                                    }}
                                    checked={this.state.multipleChoice}
                                    onChange={this.handleChange("multipleChoice")}
                                    value="{this.state.multipleChoice}"
                                />
                            }
                            label="Gilad Gray"
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
                            label="Antoine Llorca"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    classes={{
                                        root: classes.root,
                                        checked: classes.checked
                                    }}
                                    checked={this.state.simpleAnswer}
                                    onChange={this.handleChange("simpleAnswer")}
                                    value="this.state.simpleAnswer"
                                />
                            }
                            label="Jason Killian"
                        />
                    </FormGroup>
                </FormControl>

                <Button variant="contained" style={{ backgroundColor: primary, color: "white" }}>
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
