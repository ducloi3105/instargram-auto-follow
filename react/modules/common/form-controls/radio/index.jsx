var getUniqueString = (function () {
    var i = 470000;
    return function () {
        return (i++).toString(36); // convert number to base36
    };
})();

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ImsRadio extends Component {
    constructor(props) {
        super(props);
        var id = this.props.id || 'radio_' + getUniqueString();
        this.state = {
            id: id
        }
    }

    render() {
        var id = this.state.id;
        if (!this.props.disabled) {
            return (
                <span className={"ims-radio " + this.props.className}>
                    <input type="radio" id={id} checked={this.props.checked} onChange={this.props.onChange} name={this.props.name} value={this.props.value} />
                    <label className="radio-label" htmlFor={id}>{this.props.labelText}</label>
                </span>
            );
        }
        else {
            return (
                <span className={"ims-radio " + this.props.className}>
                    <input type="radio" id={id} checked={this.props.checked} disabled name={this.props.name} value={this.props.value} />
                    <label className="radio-label" htmlFor={id}>{this.props.labelText}</label>
                </span>
            );
        }
    }
}

ImsRadio.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    labelText: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    className: PropTypes.string,
    onChange: PropTypes.func
};

ImsRadio.defaultProps = {
    id: "",
    name: "",
    labelText: "",
    checked: false,
    disabled: false,
    value: "",
    className: "",
    onChange: function () {
        //empty function
    }
}

export default ImsRadio;