import MonthHeader from './month-header';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Calendar extends Component {
    constructor(props) {
        super(props);

        this.onChangeHourTime = this.onChangeHourTime.bind(this)
        this.onChangeMinuteTime = this.onChangeMinuteTime.bind(this)
        this.renderTimePicker = this.renderTimePicker.bind(this)
    }

    onChangeHourTime(event) {
        this.props.onChangeHourTime(event.target.value);
    }

    onChangeMinuteTime(event) {
        this.props.onChangeMinuteTime(event.target.value);
    }

    renderTimePicker() {
        var self = this;
        var hourTime = parseInt(self.props.hourTime),
            minuteTime = parseInt(self.props.minuteTime),
            showTime = self.props.showTime;
        if (showTime) {
            return (
                <div className="TimePicker">
                    <div className="divTableBody">
                        <div className="divTableRow">
                            <div className="divTableCell">Thời gian</div>
                            <div className="divTableCell"
                                style={{
                                    textAlign: "center",
                                    fontSize: "16px"
                                }}>{self.props.hourTime + ':' + self.props.minuteTime}</div>
                        </div>
                        <div className="divTableRow">
                            <div className="divTableCell">Giờ</div>
                            <div className="divTableCell">
                                <input max="23" min="0" type="range" value={hourTime}
                                    onChange={self.onChangeHourTime} />
                            </div>
                        </div>
                        <div className="divTableRow">
                            <div className="divTableCell">Phút</div>
                            <div className="divTableCell">
                                <input max="59" min="0" type="range" value={minuteTime}
                                    onChange={self.onChangeMinuteTime} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    render() {
        var self = this;

        return (
            <div style={{ top: self.props.top, left: self.props.left }}
                ref={function (el) {
                    self['calendarElement'] = el
                }}
                className={"ardp-calendar-" + self.props.id + " calendar" + (self.props.visible ? " calendar-show" : " calendar-hide")}>
                <MonthHeader view={self.props.view} onMove={self.onMove} selected={self.props.selected}
                    id={self.props.id} onSelect={self.props.onSelect} minDate={self.props.minDate}
                    maxDate={self.props.maxDate} />
                {self.renderTimePicker()}
            </div>
        );
    }
}

export default Calendar;