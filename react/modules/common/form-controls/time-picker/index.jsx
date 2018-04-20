"use strict";
import './css/style.css';
import DateUtilities from './components/utils';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TimePicker extends Component {
    constructor(props) {
        super(props);
        this.getDefaultState = this.getDefaultState.bind(this)
        this.hideOnDocumentClickTimePicker = this.hideOnDocumentClickTimePicker.bind(this)
        this.onChangeDate = this.onChangeDate.bind(this)
        this.onChangeHourTime = this.onChangeHourTime.bind(this)
        this.onChangeMinuteTime = this.onChangeMinuteTime.bind(this)
        this.show = this.show.bind(this)
        this.hide = this.hide.bind(this)

        this.state = this.getDefaultState()
    }

    getDefaultState() {
        var propsDate = this.props.selected, def,
            hourTime = "00", minuteTime = "00";

        if (propsDate instanceof Date && !isNaN(propsDate.getTime())) {
            def = propsDate;
            hourTime = ('0' + propsDate.getHours()).slice(-2);
            minuteTime = ('0' + propsDate.getMinutes()).slice(-2);

        } else {
            def = new Date();
            propsDate = '';
        }

        return {
            selected: DateUtilities.clone(def),
            visible: false,
            isReadOnly: this.props.isReadOnly || false,
            id: this.getUniqueIdentifier(),
            stringDate: propsDate == '' ? '' : (hourTime + ':' + minuteTime),
            hourTime: hourTime,
            minuteTime: minuteTime,
            top: 25,
            left: 0
        };
    }

    componentDidMount() {
        document.addEventListener("click", this.hideOnDocumentClickTimePicker);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.hideOnDocumentClickTimePicker);
    }

    componentWillReceiveProps(nextProps) {
        var propsDate = nextProps.selected, def,
            hourTime = "00", minuteTime = "00";

        if (propsDate instanceof Date && !isNaN(propsDate.getTime())) {
            def = propsDate;
            hourTime = ('0' + propsDate.getHours()).slice(-2);
            minuteTime = ('0' + propsDate.getMinutes()).slice(-2);
        } else {
            def = new Date();
            propsDate = '';
        }
        if (!((DateUtilities.compareDateObj(def, this.state.selected) && hourTime == this.state.hourTime && minuteTime == this.state.minuteTime) || nextProps.selected == null)) {
            //set props to state
            this.setState({
                selected: DateUtilities.clone(def),
                stringDate: propsDate === '' ? '' : (hourTime + ':' + minuteTime),
                hourTime: hourTime,
                minuteTime: minuteTime,
            });
        }
    }

    hideOnDocumentClickTimePicker(e) {
        if (typeof e.target.className !== 'string' ||
            (e.target.className.indexOf("time-picker-trigger-" + this.state.id) === -1 && !this.parentsHaveClassName(e.target, "ardp-calendar-" + this.state.id)))
            this.hide();
    }

    getUniqueIdentifier() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    parentsHaveClassName(element, className) {
        var parent = element;
        while (parent) {
            if (typeof parent.className === 'string' && parent.className.indexOf(className) > -1)
                return true;
            parent = parent.parentNode;
        }
        return false;
    }

    onChangeDate(event) {
        var self = this, strDateTime = event.target.value.trim();
        if (DateUtilities.isCorrectTime(strDateTime)) {
            var arrTime = strDateTime.split(":"),
                hourTime = parseInt(arrTime[0]),
                minuteTime = parseInt(arrTime[1]);
            var objDate = DateUtilities.buildDateTimeObj(this.state.selected, hourTime, minuteTime);
            this.setState({
                selected: objDate,
                stringDate: strDateTime
            }, function () {
                if (self.props.onSelectObj)
                    self.props.onSelectObj(objDate);
            });
        }
        else {
            this.setState({
                stringDate: event.target.value
            }, function () {
                if (self.props.onSelectObj)
                    self.props.onSelectObj(null);
            });
        }
    }

    onChangeHourTime(ev) {
        var self = this,
            hourTime = ev.target.value,
            strDateTime = ('0' + hourTime).slice(-2) + ":" + this.state.minuteTime;
        this.setState({
            hourTime: ('0' + hourTime).slice(-2),
            stringDate: strDateTime
        }, function () {
            if (self.props.onSelectObj)
                self.props.onSelectObj(DateUtilities.buildDateTimeObj(self.state.selected, ('0' + hourTime).slice(-2), self.state.minuteTime));
        });
    }

    onChangeMinuteTime(ev) {
        var minuteTime = ev.target.value,
            strDateTime = this.state.hourTime + ":" + ('0' + minuteTime).slice(-2),
            self = this;
        this.setState({
            minuteTime: ('0' + minuteTime).slice(-2),
            stringDate: strDateTime
        }, function () {
            if (self.props.onSelectObj)
                self.props.onSelectObj(DateUtilities.buildDateTimeObj(self.state.selected, self.state.hourTime, ('0' + minuteTime).slice(-2)));
        });
    }

    show(event) {
        var elInput = this['inputTimePicker' + this.state.id],
            elCalendar = this['calendar_' + this.state.id],
            isTopHalf = elInput.getBoundingClientRect().top > window.innerHeight / 2,
            isLeft = window.innerWidth - elInput.getBoundingClientRect().left > elCalendar.getBoundingClientRect().width,
            valueLeft = isLeft ? 0 : -(elCalendar.getBoundingClientRect().width + elInput.getBoundingClientRect().left - window.innerWidth);
        if (!DateUtilities.isCorrectTime(event.target.value)) {
            if (!this.state.visible) {
                this.setState({
                    visible: true,
                    hourTime: '00',
                    minuteTime: '00',
                    stringDate: '',
                    top: isTopHalf ? -80 : 27,
                    left: valueLeft
                });
            }
        }
        else {
            if (!this.state.visible) {
                this.setState({
                    visible: true,
                    top: isTopHalf ? -80 : 27,
                    left: valueLeft
                });
            }
        }
    }

    hide() {
        if (this.state.visible) {
            var strTime = this.state.stringDate;
            if (!DateUtilities.isCorrectTime(strTime)) {
                strTime = '';
            } else {
                var arrTime = strTime.split(":");
                if (arrTime.length === 2) {
                    strTime = ('0' + parseInt(arrTime[0])).slice(-2) + ":" + ('0' + parseInt(arrTime[1])).slice(-2);
                }
            }

            this.setState({
                visible: false,
                stringDate: strTime
            });
        }
    }

    render() {
        var self = this;
        return (
            <div className="ardp-time-picker">
                <input
                    ref={function (el) {
                        self['inputTimePicker' + self.state.id] = el;
                    }}
                    type="text"
                    autoComplete="off"
                    readOnly={self.state.isReadOnly}
                    placeholder={self.props.placeholder ? self.props.placeholder : 'Nhập thời gian'}
                    className={"time-picker-trigger-" + self.state.id}
                    value={self.state.stringDate}
                    onClick={self.show}
                    onChange={self.onChangeDate}
                />
                <div
                    className={"ardp-calendar-" + self.state.id + " calendar" + (self.state.visible ? " calendar-show" : " calendar-hide") }
                    style={{top: self.state.top, left: self.state.left}}
                    ref={function (el) {
                        self['calendar_' + self.state.id] = el;
                    }}
                >
                    <div className="TimePicker">
                        <div className="divTableBody">
                            <div className="divTableRow">
                                <div className="divTableCell">Thời gian</div>
                                <div className="divTableCell" style={{textAlign: "center",fontSize: "16px"}}>
                                    {self.state.hourTime + ':' + self.state.minuteTime}
                                </div>
                            </div>
                            <div className="divTableRow">
                                <div className="divTableCell">Giờ</div>
                                <div className="divTableCell">
                                    <input max="23" min="0" type="range" value={parseInt(self.state.hourTime)}
                                           onChange={self.onChangeHourTime}/>
                                </div>
                            </div>
                            <div className="divTableRow">
                                <div className="divTableCell">Phút</div>
                                <div className="divTableCell">
                                    <input max="59" min="0" type="range" value={parseInt(self.state.minuteTime)}
                                           onChange={self.onChangeMinuteTime}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

TimePicker.propTypes = {
    selected: PropTypes.object,
    onSelectObj: PropTypes.func
};

export default TimePicker;