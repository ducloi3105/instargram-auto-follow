var getUniqueString = (function () {
    var i = 470000;
    return function () {
        return (i++).toString(36); // convert number to base36
    };
})();

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Checkbox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.id,
            checked: this.props.checked
        }
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (typeof nextProps.checked != 'undefined' && nextProps.checked != this.state.checked) {
            this.setState({ checked: nextProps.checked });
        }
    }

    handleChange() {
        var self = this;
        this.setState({ checked: !this.state.checked }, function () {
            self.props.onChange(self.state.checked);
        });
    }

    render() {
        var id = this.state.id
        if (!this.props.disabled) {
            return (
                <span className={"ims-checkbox " + this.props.className}>
                    <input type="checkbox" id={id} checked={this.state.checked} onChange={this.handleChange} name={this.props.name} value={this.props.value} />
                    <label className="checkbox-label" htmlFor={id}>{this.props.labelText}</label>
                </span>
            )
        }
        else {
            return (
                <span className={"ims-checkbox " + this.props.className}>
                    <input type="checkbox" id={id} defaultChecked={this.state.checked} disabled name={this.props.name} value={this.props.value} />
                    <label className="checkbox-label" htmlFor={id}>{this.props.labelText}</label>
                </span>
            )
        }
    }
}

Checkbox.propTypes = {
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

Checkbox.defaultProps = {
    id: "",
    name: "",
    labelText: "",
    checked: false,
    disabled: false,
    value: "",
    className: "",
    onChange: function (checked) {
        //empty function
    }
}

export default Checkbox