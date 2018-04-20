import DateUtilities from './utils';
import WeekHeader from './week-header';
import Weeks from './weeks';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MonthHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: DateUtilities.clone(this.props.view),
            enabled: true,
            isForward: null
        };
        this.moveBackward = this.moveBackward.bind(this)
        this.moveForward = this.moveForward.bind(this)
        this.move = this.move.bind(this)
        this.enable = this.enable.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            view: DateUtilities.clone(nextProps.view),
        });
        return true;
    }

    moveBackward() {
        var view = DateUtilities.clone(this.state.view);
        view.setMonth(view.getMonth() - 1);
        this.move(view, false);
    }

    moveForward() {
        var view = DateUtilities.clone(this.state.view);
        view.setMonth(view.getMonth() + 1);
        this.move(view, true);
    }

    move(view, isForward) {
        var self = this;
        if (!this.state.enabled)
            return;

        this.setState({
            view: view,
            enabled: false,
            isForward: isForward
        });
    }

    enable() {
        this.setState({
            enabled: true,
            isForward: null
        });
    }

    render() {
        var self = this;
        var enabled = this.state.enabled;
        return React.createElement("div", null,
            React.createElement("div", {className: "month-header"},
                React.createElement("i", {
                    className: (enabled ? "" : " disabled"),
                    onClick: this.moveBackward
                }, String.fromCharCode(9664)),
                React.createElement("span", null, DateUtilities.toMonthAndYearString(this.state.view)),
                React.createElement("i", {
                    className: (enabled ? "" : " disabled"),
                    onClick: this.moveForward
                }, String.fromCharCode(9654))),
            React.createElement(WeekHeader, null),
            React.createElement(Weeks, {
                id: self.props.id,
                view: self.state.view,
                other: self.state.view,
                selected: self.props.selected,
                onSelect: self.props.onSelect,
                minDate: self.props.minDate,
                maxDate: self.props.maxDate,
                isForward: self.state.isForward,
                enable: self.enable
            })
        );
    }
}

export default MonthHeader;