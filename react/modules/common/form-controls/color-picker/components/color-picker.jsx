'use strict';

import InputSlider from './input-slider';
import InputNumber from './input-number';
import rgb2hsv from '../lib/rgb2hsv';
import hsv2hex from '../lib/hsv2hex';
import hsv2rgb from '../lib/hsv2rgb';
import rgb2hex from '../lib/rgb2hex';
import hex2rgb from '../lib/hex2rgb';
import rgba from '../lib/rgba';

var KEY_ENTER = 13;

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ColorPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hex: this.props.color.hex,
            hsvMode: this.props.hsvMode || false
        };
        this.changeHSV = this.changeHSV.bind(this)
        this.changeRGB = this.changeRGB.bind(this)
        this.changeAlpha = this.changeAlpha.bind(this)
        this._onSVChange = this._onSVChange.bind(this)
        this._onHueChange = this._onHueChange.bind(this)
        this._onAlphaChange = this._onAlphaChange.bind(this)
        this._onHexChange = this._onHexChange.bind(this)
        this._onHexKeyUp = this._onHexKeyUp.bind(this)
        this._onClick = this._onClick.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        var hex = nextProps.color.hex;
        this.setState({
            hex: hex
        });
        this.changeHSV = this.changeHSV.bind(this)
        this.changeRGB = this.changeRGB.bind(this)
        this.changeAlpha = this.changeAlpha.bind(this)
        this._onSVChange = this._onSVChange.bind(this)
        this._onHueChange = this._onHueChange.bind(this)
        this._onAlphaChange = this._onAlphaChange.bind(this)
        this._onHexChange = this._onHexChange.bind(this)
        this._onHexKeyUp = this._onHexKeyUp.bind(this)
        this._onClick = this._onClick.bind(this)
    }

    changeHSV(p, val) {
        if (this.props.onChange) {
            var j = p;
            if (typeof j === 'string') {
                j = {};
                j[p] = val;
            }
            var color = this.props.color;
            var rgb = hsv2rgb(j.h || color.h, j.s || color.s, j.v || color.v);
            var hex = rgb2hex(rgb.r, rgb.g, rgb.b);
            this.props.onChange(Object.assign({}, color, j, rgb, {hex: hex}));
        }
    }

    changeRGB(p, val) {
        if (this.props.onChange) {
            var j = p;
            if (typeof j === 'string') {
                j = {};
                j[p] = val;
            }

            var color = this.props.color;
            var rgb = [
                j.r !== void 0 ? j.r : color.r,
                j.g !== void 0 ? j.g : color.g,
                j.b !== void 0 ? j.b : color.b
            ];

            var hsv = rgb2hsv.apply(null, rgb);
            var hex = rgb2hex.apply(null, rgb);

            this.props.onChange(Object.assign({}, color, j, hsv, {hex: hex}));
        }
    }

    changeAlpha(a) {
        if (this.props.onChange) {
            if (a <= 100 && a >= 0) {
                this.props.onChange(Object.assign({}, this.props.color, {a: a}));
            }
        }
    }

    _onSVChange(pos) {
        this.changeHSV({
            s: pos.x,
            v: 100 - pos.y
        });
    }

    _onHueChange(pos) {
        this.changeHSV({
            h: pos.x
        });
    }

    _onAlphaChange(pos) {
        this.changeHSV({
            a: parseInt(pos.x, 10)
        });
    }

    _onHexChange(e) {
        this.setState({
            hex: e.target.value.trim()
        });
    }

    _onHexKeyUp(e) {
        if (e.keyCode === KEY_ENTER) {
            var hex = e.target.value.trim(), regexHexColor = /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i;
            if (regexHexColor.test(hex)) {
                var rgb = hex2rgb(hex);
                this.changeRGB(Object.assign({},rgb, {hex: hex}));
            } else {
                console.log('Mã màu không chính xác!');
            }
        }
    }

    _onClick(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }

    render() {
        var color = this.props.color;
        var r = color.r, g = color.g, b = color.b;
        var h = color.h, s = color.s, v = color.v;
        var a = color.a;

        var rgbaBackground = rgba(r, g, b, a);
        var opacityGradient = 'linear-gradient(to right, ' +
            rgba(r, g, b, 0) + ', ' +
            rgba(r, g, b, 100) + ')';
        var hueBackground = '#' + hsv2hex(h, 100, 100);

        return (
            <div className="m-color-picker" style={{left: this.props.left, top: this.props.top}}
                 onClick={this._onClick}>
                <div className="selector"
                     style={{backgroundColor: hueBackground}}>
                    <div className="gradient white"/>
                    <div className="gradient dark"/>
                    <InputSlider
                        className="slider slider-xy"
                        axis="xy"
                        x={s} xmax={100}
                        y={100 - v} ymax={100}
                        onChange={this._onSVChange}
                    />
                </div>

                <div className="sliders">
                    <InputSlider
                        className="slider slider-x hue"
                        axis="x" x={h} xmax={359}
                        onChange={this._onHueChange}
                    />
                    <InputSlider
                        className="slider slider-x opacity"
                        axis="x" x={a} xmax={100}
                        style={{background: opacityGradient}}
                        onChange={this._onAlphaChange}
                    />
                    <div className="color" style={{'background': rgbaBackground}}/>
                </div>

                <div className="inputs">
                    <div className="input hex">
                        <input type="text" className="value" value={this.state.hex}
                               onChange={this._onHexChange} onKeyUp={this._onHexKeyUp}/>
                        <span className="label">Hex</span>
                    </div>

                    {!this.state.hsvMode ? (
                        <div>
                            <div className="input r">
                                <InputNumber
                                    className="value" value={r} min="0" max="255"
                                    onChange={this.changeRGB.bind(null, 'r')}/>
                                <span className="label">R</span>
                            </div>
                            <div className="input g">
                                <InputNumber
                                    className="value" value={g} min="0" max="255"
                                    onChange={this.changeRGB.bind(null, 'g')}/>
                                <span className="label">G</span>
                            </div>
                            <div className="input b">
                                <InputNumber
                                    className="value" value={b} min="0" max="255"
                                    onChange={this.changeRGB.bind(null, 'b')}/>
                                <span className="label">B</span>
                            </div>
                            <div className="input a">
                                <InputNumber
                                    className="value" value={a} min="0" max="100"
                                    onChange={this.changeAlpha}/>
                                <span className="label">A</span>
                            </div>
                        </div>

                    ) : (
                        <div>
                            <div className="input h">
                                <InputNumber
                                    className="value" value={h}
                                    onChange={this.changeHSV.bind(null, 'h')}/>
                                <span className="label">H</span>
                            </div>
                            <div className="input s">
                                <InputNumber
                                    className="value" value={s}
                                    onChange={this.changeHSV.bind(null, 's')}/>
                                <span className="label">S</span>
                            </div>
                            <div className="input v">
                                <InputNumber
                                    className="value" value={v}
                                    onChange={this.changeHSV.bind(null, 'v')}/>
                                <span className="label">V</span>
                            </div>
                            <div className="input a">
                                <InputNumber
                                    className="value" value={a}
                                    onChange={this.changeAlpha}/>
                                <span className="label">A</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default ColorPicker;