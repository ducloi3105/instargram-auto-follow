'use strict';
var widthColorPicker = 242;
var heightColorPicker = 305;

import cssColor from './lib/css-color';
import rgbaColor from './lib/rgba';
import rgb2hsv from './lib/rgb2hsv';
import rgb2hex from './lib/rgb2hex';
import rgba2hex from './lib/rgba2hex';
import './css/input-color.css';
import ColorPicker from './components/color-picker';

import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

class InputColor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: this.getColor(this.props.value),
            colorPicker: false,
            colorPickerLeftPosition: 0,
            colorPickerTopPosition: 25,
            id: this.getUniqueIdentifier()
        };

        this.getColor = this.getColor.bind(this)
        this.getRgbaBackground = this.getRgbaBackground.bind(this)
        this.closeColorPicker = this.closeColorPicker.bind(this)
        this.change = this.change.bind(this)
        this._onChange = this._onChange.bind(this)
        this._onClick = this._onClick.bind(this)
        this.handleClickRemove = this.handleClickRemove.bind(this)
    }
    getUniqueIdentifier() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    getColor(color) {
        var newcolor = color || this.props.defaultValue;

        var rgba = cssColor(newcolor);
        var r = rgba.r, g = rgba.g, b = rgba.b, a = rgba.a;
        var hsv = rgb2hsv(r, g, b);

        return Object.assign({}, hsv, {
            r: r,
            g: g,
            b: b,
            a: a,
            hex: rgb2hex(r, g, b)
        });
    }

    getRgbaBackground() {
        var color = this.state.color;
        var r = color.r;
        var g = color.g;
        var b = color.b;
        var a = color.a;
        return rgbaColor(r, g, b, a);
    }
    componentDidMount() {
        document.addEventListener('click', this.closeColorPicker, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.closeColorPicker);
    }

    closeColorPicker(e) {
        var isClose = false;
        if (e.target.id.indexOf('button_' + this.state.id) === -1) {
            isClose = true;
        }
        if (isClose && this.state.colorPicker) {
            this.setState({ colorPicker: false });
        }
    }

    componentWillReceiveProps(nextProps) {
        var cssColor = nextProps.value;
        // anti-pattern, maybe
        if (!this._updated) {
            this.setState({
                color: this.getColor(cssColor)
            });
        } else {
            this._updated = false;
        }
    }

    change(cssColor) {
        if (this.props.onChange) {
            this.props.onChange(cssColor);
        }
    }

    _onChange(color) {
        this.setState({
            cssColor: '#' + color.hex,
            color: color
        });

        this._updated = true;
        this.change('#' + rgba2hex(
            color.r,
            color.g,
            color.b,
            color.a
        ));
    }

    _onClick() {
        var rect = ReactDOM.findDOMNode(this).getBoundingClientRect();
        var ww = window.innerWidth, hh = window.innerHeight;

        var left = 0;
        if (rect.left + widthColorPicker > ww) {
            left = -(widthColorPicker + 10) + ww - rect.left;
        }

        var top = 25;
        if (rect.top + heightColorPicker > hh) {
            top = -heightColorPicker - 1;
        }
        if (rect.top < heightColorPicker) {
            top = 25;
        }

        this.setState({
            colorPicker: !this.state.colorPicker,
            colorPickerLeftPosition: left,
            colorPickerTopPosition: top
        });
    }

    handleClickRemove(e) {
        this.change('');
    }

    render() {
        var rgbaBackground = this.getRgbaBackground();

        return (
            <span className={'m-input-color ' + (this.state.colorPicker ? 'color-picker-open' : '')}
                id={'colopicker_' + this.state.id}>
                <span id={'button_' + this.state.id} className="css-color" style={{ 'backgroundColor': rgbaBackground }}
                    onClick={this._onClick} />
                <span className="remove" onClick={this.handleClickRemove}>×</span>
                {this.state.colorPicker ? <ColorPicker
                    left={this.state.colorPickerLeftPosition}
                    top={this.state.colorPickerTopPosition}
                    hsvMode={this.props.hsvMode}
                    color={this.state.color}
                    onChange={this._onChange} /> : null}
            </span>
        );
    }
}

InputColor.propTypes = {
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
    hsvMode: PropTypes.bool
};

InputColor.defaultProps = {
    defaultValue: '#FFFFFF'
};
export default InputColor;