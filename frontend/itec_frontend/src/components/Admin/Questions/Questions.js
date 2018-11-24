import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SingleQuestion from "./SingleQuestion/SingleQuestion";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Edit from "@material-ui/icons/Edit";
import Add from "@material-ui/icons/Add";
import SortBy from "./Sorting/SortBy";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Sort from "@material-ui/icons/Sort";
import "./Questions.css";
import Dialog from "./Dialog/Dialog";
import NewCategoryDialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import axios from "../../../utils/axios";
const drawerWidth = 320;
const drawerHeight = 440;

const styles = theme => ({
    appBar: {
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginRight: drawerWidth
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20
    },
    hide: {
        display: "none"
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        height: drawerHeight,
        marginTop: "calc(100vh - 440px)/2"
    },
    drawerPaper: {
        width: drawerWidth,
        height: drawerHeight,
        marginTop: `calc(50vh - 220px)`,
        boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.75)",
        padding: 25
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: "0 8px",
        ...theme.mixins.toolbar,
        justifyContent: "flex-start"
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginRight: -drawerWidth
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginRight: 0
    },
    root: {
        width: "100%"
    },
    heading: {
        fontSize: theme.typography.pxToRem(15)
        // flexBasis: "1",
        // flexShrink: 0
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary
    },
    list: {
        width: "calc(100%)"
    },
    title: {
        color: "white",
        position: "relative",
        textAlign: "left",
        margin: 8,
        textTransform: "uppercase",
        fontSize: 18,
        letterSpacing: 2
    }
});

const categories = ["Personal questions", "Feedback", "JavaScript", "OOP"];

const questions = [
    {
        text: "How old are you?",
        image: "",
        choices: ["7", "12", "43"],
        answers: [2],
        score: "2",
        category: "Personal",
        difficulty_level: "6"
    },
    {
        text: "How old are you?",
        image: "",
        choices: [],
        answers: [],
        score: "2",
        category: "Personal",
        difficulty_level: "6"
    },
    {
        text: "Multiple choice question with a long name? ",
        image: "",
        choices: ["7", "12", "43"],
        answers: [0, 2],
        score: "5",
        category: "Personal",
        difficulty_level: "2"
    },
    {
        text: "Whats on your mind?",
        image: "",
        choices: [],
        answers: [],
        score: "2",
        category: "Personal",
        difficulty_level: "6"
    }
];

class Questions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: null,
            sortingOpen: false,
            addModal: false,
            category: "",
            addCategoryDialog: false,
            newCategory: ""
        };
    }

    triggerNewCategory() {
        this.setState({ addCategoryDialog: true });
    }

    triggerCloseCategoryModal() {
        this.setState({ addCategoryDialog: false, newCategory: "" });
    }

    handleClickOpen = () => {
        this.setState({ addModal: true });
    };

    handleClose = () => {
        this.setState({ addModal: false });
    };

    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false
        });
    };

    addNewCategory() {
        axios.post("/category", {
            title: this.state.newCategory
        });
    }

    renderQuestions(question) {
        return question.map((q, index) => {
            return <SingleQuestion key={index} question={q} />;
        });
    }

    renderQuestionPreview(questions) {
        return questions.map((q, index) => (
            <ListItem button key={index}>
                <ListItemText primary={q.text} />
                <Edit />
            </ListItem>
        ));
    }

    triggerNewQuestion(cat) {
        this.setState({ addModal: true, category: cat });
    }

    renderAddButton(cat) {
        return (
            <ListItem
                button
                onClick={() => {
                    this.triggerNewQuestion(cat);
                }}
            >
                <Add style={{ margin: "auto" }} />
            </ListItem>
        );
    }

    handleDrawerOpen = () => {
        this.setState({ sortingOpen: true });
    };

    handleDrawerClose = () => {
        this.setState({ sortingOpen: false });
    };
    renderCategories() {
        const { classes } = this.props;
        const { expanded } = this.state;
        return categories.map((cat, index) => {
            return (
                <ExpansionPanel key={index} expanded={expanded === cat} onChange={this.handleChange(cat)}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>{cat}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className={classes.list}>
                            <List>
                                {this.renderQuestionPreview(questions)}
                                {this.renderAddButton(cat)}
                            </List>
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            );
        });
    }

    handleNewCategoryChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    render() {
        const { classes, theme } = this.props;

        return (
            <div className="questionsContainer">
                <div className="openDrawerButton" onClick={() => this.handleDrawerOpen()}>
                    <Sort style={{ marginTop: "13px" }} />
                </div>
                <div style={{ display: "flex" }}>
                    <Typography className={classes.title}>Categories</Typography>
                    <div style={{ margin: "auto" }} />
                    <Typography
                        onClick={() => this.triggerNewCategory()}
                        style={{ fontSize: 30, cursor: "pointer" }}
                        className={classes.title}
                    >
                        +
                    </Typography>
                </div>
                {this.renderCategories()}

                <NewCategoryDialog
                    open={this.state.addCategoryDialog}
                    onClose={() => this.triggerCloseCategoryModal()}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">New Category</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the name of the new category you wish to add.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            value={this.state.newCategory}
                            onChange={this.handleNewCategoryChange("newCategory")}
                            id="name"
                            label="Category name"
                            type="email"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.triggerCloseCategoryModal()} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.addNewCategory()} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </NewCategoryDialog>

                <Dialog
                    handleClose={this.handleClose}
                    handleClickOpen={this.handleClickOpen}
                    open={this.state.addModal}
                />

                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="right"
                    open={this.state.sortingOpen}
                    classes={{
                        paper: classes.drawerPaper
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={this.handleDrawerClose}>
                            {theme.direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                        Sorting and Filters
                    </div>
                    <SortBy />
                </Drawer>
            </div>
        );
    }
}

Questions.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Questions);
