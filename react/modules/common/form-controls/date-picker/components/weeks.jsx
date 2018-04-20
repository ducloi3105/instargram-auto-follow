import DateUtilities from './utils';
import Week from './week';

import React, { Component } from 'react';

class Weeks extends Component {
    constructor(props){
        super(props);

        this.onTransitionEnd = this.onTransitionEnd.bind(this)
        this.renderWeeks = this.renderWeeks.bind(this)
    }
    componentDidMount() {
        var self = this;
        self['currentWeeks' + self.props.id].addEventListener("transitionend", self.onTransitionEnd);
    }

    componentWillUnmount() {
        if (this['currentWeeks' + this.props.id] !== null){
            this['currentWeeks' + this.props.id].removeEventListener("transitionend", this.onTransitionEnd);
        }
    }

    onTransitionEnd() {
        this.props.enable();
    }

    getWeekStartDates(view) {
        view.setDate(1);
        view = DateUtilities.moveToDayOfWeek(DateUtilities.clone(view), 0);

        var current = DateUtilities.clone(view);
        current.setDate(current.getDate() + 7);

        var starts = [view], month = current.getMonth();
        while (current.getMonth() === month) {
            starts.push(DateUtilities.clone(current));
            current.setDate(current.getDate() + 7);
        }
        return starts;
    }

    renderWeeks(view) {
        var starts = this.getWeekStartDates(view),
            month = starts[1].getMonth();

        return starts.map(function (s, i) {
            return React.createElement(Week, {
                key: i,
                start: s,
                month: month,
                selected: this.props.selected,
                onSelect: this.props.onSelect,
                minDate: this.props.minDate,
                maxDate: this.props.maxDate
            });
        }.bind(this));
    }

    render() {
        var self = this;
        return React.createElement("div", {className: "weeks"},
            React.createElement("div", {
                    ref(el) {
                        self['currentWeeks' + self.props.id] = el
                    },
                    className: "current" + (this.props.isForward ? (" sliding left") : (this.props.isForward === null ? "" : " sliding right"))
                },
                this.renderWeeks(this.props.view)
            ),
            React.createElement("div", {
                    className: "other" + (this.props.isForward ? (" sliding left") : (this.props.isForward === null ? "" : " sliding right"))
                },
                this.renderWeeks(this.props.other)
            )
        );
    }
}

export default Weeks;