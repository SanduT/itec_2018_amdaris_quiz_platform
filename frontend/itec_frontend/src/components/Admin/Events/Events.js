import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
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
import "./Events.css";
import Dialog from "./Dialog/Dialog";
import NewEventDialog from "@material-ui/core/Dialog";
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

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: null,
            categories: [],
            questions: [],
            addEventDialog: false,
            newEvent: "",
            events: [],
            event: ""
        };
    }

    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false
        });
    };

    renderEvents() {
        const { classes } = this.props;
        const { expanded } = this.state;
        return this.state.events.map((event, index) => {
            return (
                <ExpansionPanel
                    key={index}
                    expanded={expanded === event.event.title}
                    onChange={this.handleChange(event.event.title)}
                >
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>{event.event.title}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className={classes.list}>
                            <List>
                                {this.renderQuizPreview(event.childQuiz)}
                                {this.renderAddButton(event.event)}
                            </List>
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            );
        });
    }

    triggerNewQuiz(event) {
        this.setState({ addModal: true, event: event });
    }

    renderAddButton(event) {
        return (
            <ListItem
                button
                onClick={() => {
                    this.triggerNewQuiz(event);
                }}
            >
                <Add style={{ margin: "auto" }} />
            </ListItem>
        );
    }

    renderQuizPreview(quizzes) {
        return quizzes.map((q, index) => (
            <ListItem button key={index}>
                <ListItemText primary={q.title} />
                <Edit />
            </ListItem>
        ));
    }
    handleClose = () => {
        this.setState({ addModal: false });
    };

    handleClickOpen = () => {
        this.setState({ addModal: true });
    };

    getQuestions() {
        axios
            .get("/question")
            .then(resp => {
                console.log(resp);
                this.setState({
                    questions: resp.data
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    getCategories() {
        axios
            .get("/category")
            .then(resp => {
                console.log(resp);
                this.setState({
                    categories: resp.data.categoriesWithChildren,
                    defaultCategory: resp.data.noCategoryChildren
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
    componentWillMount() {
        this.getCategories();
        this.getQuestions();
        this.getEvents();
    }
    getQuestionOptions() {
        let options = [];

        for (let question of this.state.questions) {
            let op = {
                value: question._id,
                label: question.text
            };
            options.push(op);
        }
        console.log(options);

        return options;
    }

    triggerNewEvent() {
        this.setState({ addEventDialog: true });
    }
    triggerCloseEventModal() {
        this.setState({ addEventDialog: false, newEvent: "" });
    }

    handleNewEventChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    addNewEvent() {
        axios
            .post("/event", {
                title: this.state.newEvent
            })
            .then(() => {
                this.triggerCloseEventModal();
                this.getEvents();
            });
    }

    getEvents() {
        axios
            .get("/event")
            .then(resp => {
                console.log(resp);
                this.setState({
                    events: resp.data
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <div className="questionsContainer">
                <div style={{ display: "flex" }}>
                    <Typography className={classes.title}>Events</Typography>
                    <div style={{ margin: "auto" }} />
                    <Typography
                        onClick={() => this.triggerNewEvent()}
                        style={{ fontSize: 30, cursor: "pointer" }}
                        className={classes.title}
                    >
                        +
                    </Typography>
                </div>
                {this.renderEvents()}

                <NewEventDialog
                    open={this.state.addEventDialog}
                    onClose={() => this.triggerCloseEventModal()}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">New Event</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Please enter the name of the new event you wish to add.</DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            value={this.state.newEvent}
                            onChange={this.handleNewEventChange("newEvent")}
                            id="name"
                            label="Category name"
                            type="email"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.triggerCloseEventModal()} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.addNewEvent()} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </NewEventDialog>

                <Dialog
                    handleClose={this.handleClose}
                    handleClickOpen={this.handleClickOpen}
                    open={this.state.addModal}
                    getCategories={() => this.getCategories()}
                    categories={this.state.categories}
                    questions={this.state.questions}
                    questionOptions={this.getQuestionOptions}
                    currentEvent={this.state.event}
                    // event={this.state.category}
                />
            </div>
        );
    }
}
Events.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Events);
