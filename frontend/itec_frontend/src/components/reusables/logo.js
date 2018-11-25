import React from "react";
import wand from "../../assets/magic-wand.png";
import "./logo.css";
const logo = props => {
    return (
        <div style={{ display: "flex", marginLeft: 16 }}>
            <img
                style={{
                    width: 45,
                    height: 45,
                    marginTop: 6
                }}
                src={wand}
                alt="wand"
            />
            <p
                style={{
                    color: "white",
                    fontSize: 35,
                    marginTop: 17,
                    marginLeft: 7
                }}
                className="logoText"
            >
                Quizzard
            </p>
        </div>
    );
};

export default logo;
