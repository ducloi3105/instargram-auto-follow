'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

class InputSlider extends Component {
    constructor(props){
        super(props);
        this.getPosition = this.getPosition.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.change = this.change.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.getPos = this.getPos.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
    }
    getClientPosition(e) {
        var touches = e.touches;
        if (touches && touches.length) {
            var finger = touches[0];
            return {
                x: finger.clientX,
                y: finger.clientY
            };
        }
        return {
            x: e.clientX,
            y: e.clientY
        };
    }

    getPosition() {
        var top = (this.props.y - this.props.ymin) / (this.props.ymax - this.props.ymin) * 100;
        var left = (this.props.x - this.props.xmin) / (this.props.xmax - this.props.xmin) * 100;

        if (top > 100) top = 100;
        if (top < 0) top = 0;
        if (this.props.axis === 'x') top = 0;
        top += '%';

        if (left > 100) left = 100;
        if (left < 0) left = 0;
        if (this.props.axis === 'y') left = 0;
        left += '%';

        return {top: top, left: left};
    }

    handleClick(e) {
        var clientPos = this.getClientPosition(e), rect = ReactDOM.findDOMNode(this).getBoundingClientRect();

        this.change(
            {
                left: clientPos.x - rect.left,
                top: clientPos.y - rect.top
            },
            true
        );
    }
    change(pos, dragEnd) {
        if (!this.props.onChange) return;

        var rect = ReactDOM.findDOMNode(this).getBoundingClientRect(), height = rect.height, width = rect.width,
            axis = this.props.axis, top = pos.top, left = pos.left;

        if (left < 0) left = 0;
        if (left > width) left = width;
        if (top < 0) top = 0;
        if (top > height) top = height;

        var x = 0, y = 0;
        if (axis === 'x' || axis === 'xy') {
            x = left / width * (this.props.xmax - this.props.xmin) + this.props.xmin;
        }
        if (axis === 'y' || axis === 'xy') {
            y = top / height * (this.props.ymax - this.props.ymin) + this.props.ymin;
        }

        this.props.onChange({x: x, y: y});
    }

    handleMouseDown(e) {
        e.preventDefault();
        var clientPos = this.getClientPosition(e);

        this.offset = {
            x: clientPos.x,
            y: clientPos.y
        };

        document.addEventListener('mousemove', this.handleDrag);
        document.addEventListener('mouseup', this.handleDragEnd);

        document.addEventListener('touchmove', this.handleDrag);
        document.addEventListener('touchend', this.handleDragEnd);
        document.addEventListener('touchcancel', this.handleDragEnd);
    }

    getPos(e) {
        var clientPos = this.getClientPosition(e);
        var rect = ReactDOM.findDOMNode(this).getBoundingClientRect(), height = rect.height, width = rect.width,
            top = clientPos.y - rect.top, left = clientPos.x - rect.left;

        if (left < 0) left = 0;
        if (left > width) left = width;
        if (top < 0) top = 0;
        if (top > height) top = height;

        return {
            left: left,
            top: top
        };
    }

    handleDrag(e) {
        e.preventDefault();
        this.change(this.getPos(e));
    }

    handleDragEnd(e) {
        e.preventDefault();
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.handleDragEnd);

        document.removeEventListener('touchmove', this.handleDrag);
        document.removeEventListener('touchend', this.handleDragEnd);
        document.removeEventListener('touchcancel', this.handleDragEnd);

        if (this.props.onDragEnd) {
            this.props.onDragEnd();
        }
    }
    render() {
        var self = this, axis = this.props.axis, pos = this.getPosition(), valueStyle = {};
        if (axis === 'x') valueStyle.width = pos.left;
        if (axis === 'y') valueStyle.height = pos.top;

        var className = 'u-slider u-slider-' + axis + ' ' + (this.props.className || '');

        return (
            <div onClick={this.handleClick} className={className} axis={axis}
                 x={this.props.x} y={this.props.y} style={this.props.style}
                 xmin={this.props.xmin} xmax={this.props.xmax} ymin={this.props.ymin} ymax={this.props.ymax}
                 onTouchStart={this.handleMouseDown} onMouseDown={this.handleMouseDown}>
                <div className="value" style={valueStyle}/>
                <div
                    className="handle"
                    onTouchStart={this.handleMouseDown}
                    onMouseDown={this.handleMouseDown}
                    onClick={function (e) {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                    }}
                    style={pos}
                />
            </div>
        );
    }
}

InputSlider.propTypes = {
    axis: PropTypes.string,
    x: PropTypes.number,
    xmax: PropTypes.number,
    xmin: PropTypes.number,
    y: PropTypes.number,
    ymax: PropTypes.number,
    ymin: PropTypes.number
};

InputSlider.defaultProps = {
    axis: 'x',
    xmin: 0,
    ymin: 0
};

export default InputSlider;