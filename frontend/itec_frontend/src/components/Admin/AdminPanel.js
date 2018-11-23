import React, { Component } from "react";
import { adminColor } from "../../styles/colors";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import Drawer from "@material-ui/core/Drawer";
import SideNavigation from "./SideNavigation";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Questions from "./Questions/Questions";
import Statistics from "./Statistics/Statistics";
import AdminLogin from "./AdminLogin";

// import { connect } from 'react-redux'

const styles = theme => ({
    list: {
        width: 250
    },
    fullList: {
        width: "auto"
    },
    root: {
        width: "100%"
    },
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    },
    title: {
        display: "none",
        [theme.breakpoints.up("sm")]: {
            display: "block"
        }
    },
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: fade(theme.palette.common.white, 0.25)
        },
        marginLeft: 0,
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing.unit,
            width: "auto"
        }
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    inputRoot: {
        color: "inherit",
        width: "100%"
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: 120,
            "&:focus": {
                width: 200
            }
        }
    }
});
class AdminPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            left: false
        };
    }

    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar style={{ backgroundColor: adminColor, color: "white" }}>
                        <IconButton
                            onClick={this.toggleDrawer("left", true)}
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="Open drawer"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                            Admin Panel
                        </Typography>
                        <div className={classes.grow} />
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput
                                }}
                            />
                        </div>
                    </Toolbar>
                    <Drawer open={this.state.left} onClose={this.toggleDrawer("left", false)}>
                        <div
                            tabIndex={0}
                            role="button"
                            onClick={this.toggleDrawer("left", false)}
                            onKeyDown={this.toggleDrawer("left", false)}
                        >
                            {<SideNavigation class={classes} history={this.props.history} />}
                        </div>
                    </Drawer>
                </AppBar>

                <Router>
                    <div>
                        <Route path={`${this.props.match.url}/`} exact component={AdminLogin} />
                        <Route path={`${this.props.match.url}/statistics`} exact component={Statistics} />
                        <Route path={`${this.props.match.url}/questions`} exact component={Questions} />
                    </div>
                </Router>
            </div>
        );
    }
}

AdminPanel.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AdminPanel);
