var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_ENTER = 13;

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class InputNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.parse(this.props.value)
        };
        this.parse = this.parse.bind(this)
        this.change = this.change.bind(this)
        this.up = this.up.bind(this)
        this.down = this.down.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.parseNumber = this.parseNumber.bind(this)
    }
    parse(val) {
        return this.parseNumber(val, this.props.step, this.props.max, this.props.min);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: this.parse(nextProps.value)
        });
    }

    change(value) {
        if (this.props.onChange) {
            this.props.onChange(this.parse(value));
        }
    }

    up() {
        this.change(this.state.value + this.props.step);
    }

    down() {
        this.change(this.state.value - this.props.step);
    }

    handleKeyDown(e) {
        switch (e.keyCode) {
            case KEY_UP:
                e.preventDefault();
                this.up();
                break;
            case KEY_DOWN:
                e.preventDefault();
                this.down();
                break;
        }
    }

    handleKeyUp(e) {
        this.change(this.state.value);
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    parseNumber(value, step, max, min) {
        if (value === '') return '';
        if (value) {
            value = parseFloat(value);
            if (isNaN(value)) return '';
        }

        if (!isNaN(max) && value > parseFloat(max)) return max;
        if (!isNaN(min) && value < parseFloat(min)) return min;

        if (step) {
            var p = (step.toString().split('.')[1] || []).length;
            if (p) return parseFloat(value.toFixed(p));
        }

        return value;
    }

    render() {
        return (
            <input type="text" className={this.props.className} step={this.props.step} min={this.props.min}
                max={this.props.max}
                value={this.state.value} onKeyUp={this.handleKeyUp}
                onKeyDown={this.handleKeyDown} onChange={this.handleChange} />
        );

    }
}

InputNumber.propTypes = {
    step: PropTypes.number,
    value: PropTypes.number
};

InputNumber.defaultProps = {
    step: 1
};

export default InputNumber;