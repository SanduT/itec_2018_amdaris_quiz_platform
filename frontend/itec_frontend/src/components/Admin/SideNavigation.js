import React from "react";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/QuestionAnswer";
import Event from "@material-ui/icons/Event";
import Graph from "@material-ui/icons/GraphicEq";

const SideNavigation = props => {
    const { classes } = props;

    const sections = [
        {
            text: "Questions",
            icon: <InboxIcon />,
            goto: "/admin/questions"
        },
        {
            text: "Statistics",
            icon: <Graph />,
            goto: "/admin/statistics"
        },
        {
            text: "Events",
            icon: <Event />,
            goto: "/admin/events"
        }
    ];

    return (
        <div className={props.class.list}>
            <List>
                {sections.map((q, index) => (
                    <ListItem button key={index} onClick={() => props.history.push(q.goto)}>
                        {q.icon}
                        <ListItemText primary={q.text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default SideNavigation;
