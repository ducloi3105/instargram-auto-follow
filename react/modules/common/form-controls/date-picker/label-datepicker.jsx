"use strict";
import style from './css/style.css';
import DateUtilities from './components/utils';
import Calendar from './components/calendar';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LabelDatePicker extends Component {
    constructor(props) {
        super(props);
        var propsDate = this.props.selected, def,
            hourTime = "00", minuteTime = "00";
        this.showTime = this.props.showTime !== false;

        if (typeof propsDate === 'string') {
            if (DateUtilities.isCorrectDateTime(propsDate)) {
                var strDate = propsDate.substring(0, 10),
                    strTime = propsDate.substring(10, propsDate.length).trim();
                def = DateUtilities.buildDateObj(strDate);
                hourTime = strTime.split(":")[0];
                minuteTime = strTime.split(":")[1];

            } else if (DateUtilities.isCorrectDate(propsDate)) {
                def = DateUtilities.buildDateObj(propsDate);
            } else {
                def = new Date();
                propsDate = '';
            }
        } else if (propsDate instanceof Date && !isNaN(propsDate.getTime())) {
            def = propsDate;
            hourTime = ('0' + propsDate.getHours()).slice(-2);
            minuteTime = ('0' + propsDate.getMinutes()).slice(-2);

        } else {
            def = new Date();
            propsDate = '';
        }

        this.state = {
            view: DateUtilities.clone(def),
            selected: DateUtilities.clone(def),
            minDate: null,
            maxDate: null,
            visible: false,
            isReadOnly: this.props.isReadOnly || false,
            id: this.getUniqueIdentifier(),
            stringDate: propsDate === '' ? '' : DateUtilities.toString(def) + (this.showTime ? ' ' + hourTime + ':' + minuteTime : ''),
            hourTime: hourTime,
            minuteTime: minuteTime,
            top: -999,
            left: 0
        };

        this.hideOnDocumentClick = this.hideOnDocumentClick.bind(this)
        this.onChangeDate = this.onChangeDate.bind(this)
        this.onChangeHourTime = this.onChangeHourTime.bind(this)
        this.onChangeMinuteTime = this.onChangeMinuteTime.bind(this)
        this.setMinDate = this.setMinDate.bind(this)
        this.setMaxDate = this.setMaxDate.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.show = this.show.bind(this)
        this.hide = this.hide.bind(this)
    }

    componentDidMount() {
        document.addEventListener("click", this.hideOnDocumentClick);
        this['inputDateTimePicker' + this.state.id].click();
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.hideOnDocumentClick);
    }

    componentWillReceiveProps(nextProps) {
        var propsDate = nextProps.selected, def,
            hourTime = "00", minuteTime = "00";
        if (typeof propsDate === 'string') {
            if (DateUtilities.isCorrectDateTime(propsDate)) {
                var strDate = propsDate.substring(0, 10),
                    strTime = propsDate.substring(10, propsDate.length).trim();
                def = DateUtilities.buildDateObj(strDate);
                hourTime = strTime.split(":")[0];
                minuteTime = strTime.split(":")[1];

            } else if (DateUtilities.isCorrectDate(propsDate)) {
                def = DateUtilities.buildDateObj(propsDate);
            } else {
                def = new Date();
                propsDate = '';
            }
        } else if (propsDate instanceof Date && !isNaN(propsDate.getTime())) {
            def = propsDate;
            hourTime = ('0' + propsDate.getHours()).slice(-2);
            minuteTime = ('0' + propsDate.getMinutes()).slice(-2);
        } else {
            def = new Date();
            propsDate = '';
        }

        if (!((DateUtilities.compareDateObj(def, this.state.selected) && hourTime === this.state.hourTime && minuteTime === this.state.minuteTime) || nextProps.selected === '' || nextProps.selected === null)) {
            //set props to state
            this.setState({
                view: DateUtilities.clone(def),
                selected: DateUtilities.clone(def),
                stringDate: propsDate === '' ? '' : DateUtilities.toString(def) + (this.showTime ? ' ' + hourTime + ':' + minuteTime : ''),
                hourTime: hourTime,
                minuteTime: minuteTime,
            });
        }
    }
	
	hideOnDocumentClick(e) {
        if (typeof e.target.className !== 'string' ||
            (e.target.className.indexOf("date-picker-trigger-" + this.state.id) === -1 && !this.parentsHaveClassName(e.target, "ardp-calendar-" + this.state.id)))
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
        if (DateUtilities.isCorrectDateTime(strDateTime) && this.showTime) {
            var strDate = strDateTime.substring(0, 10),
                strTime = strDateTime.substring(10, strDateTime.length).trim(),
                DateObj = DateUtilities.buildDateObj(strDate);

            this.setState({
                selected: DateObj,
                view: DateObj,
                stringDate: strDate + " " + strTime,
                hourTime: strTime.split(":")[0],
                minuteTime: strTime.split(":")[1]
            }, function () {
                if (self.props.onSelect)
                    self.props.onSelect(strDateTime);
                if (self.props.onSelectObj)
                    self.props.onSelectObj(DateUtilities.buildDateTimeObj(DateObj, strTime.split(":")[0], strTime.split(":")[1]));
            });

        }
        else if (DateUtilities.isCorrectDate(strDateTime) && !(this.showTime)) {
            this.setState({
                selected: DateUtilities.buildDateObj(strDateTime),
                view: DateUtilities.buildDateObj(strDateTime),
                stringDate: strDateTime
            }, function () {
                if (self.props.onSelect)
                    self.props.onSelect(strDateTime);
                if (self.props.onSelectObj)
                    self.props.onSelectObj(DateUtilities.buildDateTimeObj(DateUtilities.buildDateObj(strDateTime), 0, 0));
            });
        }
        else {
            this.setState({
                stringDate: event.target.value
            }, function () {
                if (self.props.onSelect)
                    self.props.onSelect('');
                if (self.props.onSelectObj)
                    self.props.onSelectObj(null);
            });
        }
    }

    onChangeHourTime(hourTime) {
        var self = this;
        var strDateTime = DateUtilities.toString(this.state.selected) + " " + ('0' + hourTime).slice(-2) + ":" + this.state.minuteTime;
        this.setState({
            hourTime: ('0' + hourTime).slice(-2),
            stringDate: strDateTime
        }, function () {
            if (self.props.onSelect)
                self.props.onSelect(strDateTime);
            if (self.props.onSelectObj)
                self.props.onSelectObj(DateUtilities.buildDateTimeObj(self.state.selected, ('0' + hourTime).slice(-2), self.state.minuteTime));
        });
    }

    onChangeMinuteTime(minuteTime) {
        var strDateTime = DateUtilities.toString(this.state.selected) + " " + this.state.hourTime + ":" + ('0' + minuteTime).slice(-2),
            self = this;
        this.setState({
            minuteTime: ('0' + minuteTime).slice(-2),
            stringDate: strDateTime
        }, function () {
            if (self.props.onSelect)
                self.props.onSelect(strDateTime);
            if (self.props.onSelectObj)
                self.props.onSelectObj(DateUtilities.buildDateTimeObj(self.state.selected, self.state.hourTime, ('0' + minuteTime).slice(-2)));
        });
    }

    setMinDate(date) {
        this.setState({minDate: date});
    }

    setMaxDate(date) {
        this.setState({maxDate: date});
    }

    onSelect(day) {
        var self = this;
        this.setState({
            selected: DateUtilities.clone(day),
            view: DateUtilities.clone(day),
            stringDate: DateUtilities.toString(day) + (self.showTime ? " " + this.state.hourTime + ":" + this.state.minuteTime : '')
        }, function () {
            if (self.props.onSelect)
                self.props.onSelect(this.state.stringDate);
            if (self.props.onSelectObj)
                self.props.onSelectObj(DateUtilities.buildDateTimeObj(this.state.selected, this.state.hourTime, this.state.minuteTime));
            self.hide();
        });
    }

    show(event) {
        var elInput = this['inputDateTimePicker' + this.state.id],
            elCalendar = this['calendar_' + this.state.id],
            isTopHalf = elInput.getBoundingClientRect().top > window.innerHeight / 2,
            valueTop = isTopHalf ? -(elCalendar.getBoundingClientRect().height) : elInput.getBoundingClientRect().height,
            isLeft = window.innerWidth - elInput.getBoundingClientRect().left > elCalendar.getBoundingClientRect().width,
            valueLeft = isLeft ? 0 : -(elCalendar.getBoundingClientRect().width + elInput.getBoundingClientRect().left - window.innerWidth);

        if (!DateUtilities.isCorrectDateTime(event.target.value) && !DateUtilities.isCorrectDate(event.target.value)) {
            if (!this.state.visible) {
                this.setState({
                    view: new Date(),
                    visible: true,
                    selected: new Date(),
                    hourTime: '00',
                    minuteTime: '00',
                    stringDate: '',
                    top: valueTop,
                    left: valueLeft
                });
            }
        } else {
            if (!this.state.visible) {
                this.setState({
                    visible: true,
                    top: isTopHalf ? -270 : 25,
                    left: valueLeft
                });
            }
        }
    }

    hide() {
        if (this.state.visible) {
            var strDate = this.state.stringDate;
            if (!(DateUtilities.isCorrectDateTime(strDate) && this.showTime) && !(DateUtilities.isCorrectDate(strDate) && !(this.showTime))) {
                strDate = '';
            }
            this.setState({
                visible: false,
                stringDate: strDate
            });
        }
    }

    render() {
        var self = this;
        return (
            <div className="ardp-date-picker label-date-picker" onMouseLeave={this.props.onMouseLeave}>
                <Calendar id={ self.state.id}
                          showTime={ self.showTime}
                          view={ self.state.view}
                          selected={ self.state.selected}
                          onSelect={ self.onSelect}
                          minDate={ self.state.minDate}
                          maxDate={ self.state.maxDate}
                          visible={ true}
                          top={ self.state.top}
                          left={ self.state.left}
                          hourTime={ self.state.hourTime}
                          minuteTime={ self.state.minuteTime}
                          onChangeHourTime={ self.onChangeHourTime}
                          onChangeMinuteTime={ self.onChangeMinuteTime}/>
                <input type="text"
                       ref={function (el) {self['inputDateTimePicker' + self.state.id] = el}}
                       name={ self.props.nameInputDate || null}
                       autoComplete='off'
                       readOnly={self.state.isReadOnly}
                       placeholder={ self.props.placeholder ? self.props.placeholder :'Nhập ngày'}
                       className={ (self.showTime ? 'minWidthInput ' : '') + "date-picker-trigger-" + self.state.id + ' label-date-picker'}
                       value={ self.state.stringDate}
                       contentEditable={ true}
                       onClick={ self.show}
                       onChange={self.onChangeDate}/>
            </div>
        )
    }
}

LabelDatePicker.propTypes = {
    selected: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
    showTime: React.PropTypes.bool,
    nameInputDate: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    onSelectObj: React.PropTypes.func
};

export default LabelDatePicker;