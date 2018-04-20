import './css/input-ranger.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ImsInputRange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            minStep: props.minStep,
            maxStep: props.maxStep,
            step: props.step,
            name: props.name,
            showStepList: props.showStepList || false,
        }
        this.renderDataList = this.renderDataList.bind(this)
        this.onChangeData = this.onChangeData.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value != this.state.value) {
            this.setState({value: nextProps.value})
        }
    }

    onChangeData(e) {
        var self = this;
        var value = parseFloat(e.target.value);
        this.setState({value: e.target.value}, function () {
            if (typeof self.props.onChangeData == 'function') self.props.onChangeData(value)
        })
    }

    renderDataList() {
        var state = this.state, options = [];
        var start = parseInt(state.minStep);
        var stop = parseInt(state.maxStep);
        var step = parseFloat(state.step)

        for (var min = start; min <= stop; min += step) {
            if (min == start || min == stop) {
                if (min == start) {
                    options.push(
                        <span key={min}>{min}</span>
                    )
                } else {
                    var lengthStep = (parseInt(min) + '').length;
                    var right = 0;
                    for (var i = 0; i < lengthStep; i++) {
                        right -= 4;
                    }
                    options.push(
                        <div key={min}>
                            <span style={{right: right}}>{min}</span>
                        </div>
                    )
                }
            } else {
                options.push(
                    <div key={min}>
                        <span></span>
                    </div>
                )
            }
        }
        return (
            <div id="slide-wrapper">
                <div id="slide-tick">
                    {options}
                </div>
            </div>
        )
    }
    render() {
        var state = this.state;
        return (
            <div style={{width: this.props.width}} className="ims-input-range">
                <input type="range" className="content_range_input" min={state.minStep} max={state.maxStep}
                       step={state.step}
                       value={state.value} name={state.name}
                       onChange={this.onChangeData} style={{width: this.props.width}}/>

                {this.renderDataList()}
            </div>
        )
    }
}
ImsInputRange.propTypes = {
    value: PropTypes.number,
    minStep: PropTypes.number,
    maxStep: PropTypes.number,
    step: PropTypes.number,
    name: PropTypes.string,
    onChangeData: PropTypes.func,
    width: PropTypes.string,
    showStepList: PropTypes.bool,
}
ImsInputRange.defaultProps = {
    value: 0,
    minStep: 0,
    maxStep: 10,
    step: 1,
    name: "",
    onChangeData: function () {
    },
    width: '100%',
    showStepList: false,
}

export default ImsInputRange;