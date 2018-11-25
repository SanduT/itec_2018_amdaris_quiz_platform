import React, { Component } from "react";
// import { connect } from 'react-redux'
class SingleQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderSimpleAnswerQuestion() {}

    renderQuestion() {
        if (this.props.question.choices.length === 0) {
            this.renderSimpleAnswerQuestion();
        } else if (this.props.question.answers.length === 1) {
            this.renderSingleChoiceQuestion();
        } else this.renderMultipleChoiceQuestion();
    }

    render() {
        return <div />;
    }
}
export default SingleQuestion;
