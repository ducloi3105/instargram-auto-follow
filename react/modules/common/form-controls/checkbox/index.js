import React,{ Component } from 'react'
import RandomUtil from '../../../utils/random-util.js'
import PropTypes from 'prop-types';

class Checkbox extends Component {
    constructor(props) {
        super(props)
        this.state = { checked: this.props.checked };
        this.id = this.props.id || RandomUtil.randomId();
        this.HandleChange = this.HandleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (typeof nextProps.checked != 'undefined' && nextProps.checked != this.state.checked) {
            this.setState({ checked: nextProps.checked });
        }
    }

    HandleChange() {
        const { onChange } = this.props;
        const checked = !this.state.checked;
        this.setState({ checked: checked }, () => {
            if (typeof onChange == 'function') {
                onChange(checked);
            }
        });
    }

    render() {
        const id = this.id;
        const { checked } = this.state;
        const { type, disabled, name, CheckboxClassName, LabelClassName, labelText } = this.props
        if (type == "normal") {
            return (
                <div>
                    <input type="checkbox"
                        className={CheckboxClassName}
                        id={id}
                        name={name}
                        checked={checked}
                        onChange={this.HandleChange} />
                    <label className={LabelClassName}
                        htmlFor={id}>
                        {labelText}
                    </label>
                </div>
            )
        } else {
            return (
                <div className="onoffswitch">
                    <input type="checkbox" className="onoffswitch-checkbox"
                        id={id}
                        name={name}
                        checked={checked}
                        onChange={this.HandleChange}
                        disabled={disabled} />
                    <label className="onoffswitch-label"
                        htmlFor={id}>
                        <div className="onoffswitch-inner red"></div>
                        <div className="onoffswitch-switch"></div>
                    </label>
                </div>
            )
        }
    }
}


Checkbox.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    labelText: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    CheckboxClassName: PropTypes.string,
    LabelClassName: PropTypes.string,
    onChange: PropTypes.func,
    type: PropTypes.oneOf(["onoffswitch", "normal"]).isRequired
}

Checkbox.defaultProps = {
    type: "onoffswitch",
    checked: false,
    disabled: false,
    name: "",
    labelText: "",
    CheckboxClassName: "",
    LabelClassName: ""
}

export default Checkbox;