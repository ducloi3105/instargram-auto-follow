require('./styles.css');

var Input = React.createClass({
    getInitialState: function() {
        return { value: this.props.value, warning: '' };
    },
    getDefaultProps: function() {
        return {
            value: '',
            onChange: function(newVal, isValid) {},
            type: 'text',
            placeholder: '',
            validator: function(value) { return false; }, // return string to show error string
            autoFocus: false,
            onEnter: function(val) {},
            className: '',
            divClassName: '',
            onFocus: function(e) {},
            inputRef: function(e) {},
            componentDidMount: function() {}
        };
    },
    componentDidMount: function() {
        this.props.componentDidMount();
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ value: nextProps.value }, this.validate);
        }
    },
    handleKeyPress: function(e) {
        var val = e.target.value;
        if (e.key === 'Enter') this.props.onEnter(val);
    },
    validate: function(callback) {
        if (!callback || callback.constructor !== Function) callback = function() {};
        var warning = this.props.validator(this.state.value) || '';
        this.setState({ warning: warning }, function() {
            var isValid = !warning;
            callback(isValid);
        });
    },
    render: function() {
        var that = this;
        var callback = this.props.onChange;
        var classNames = ['jsx-input'];
        if (this.props.divClassName) classNames.unshift(this.props.divClassName);
        if (that.state.warning) classNames.push('not-valid');
        return (
            <div className={classNames.join(' ')}>
                <input
                    type={that.props.type}
                    value={that.state.value}
                    onChange={function(e) {
                        that.setState({ value: e.target.value }, function() {
                            that.validate(function(isValid) {
                                callback(that.state.value, isValid);
                            });
                        });
                    }}
                    placeholder={that.props.placeholder}
                    autoFocus={!!that.props.autoFocus}
                    onKeyPress={that.handleKeyPress}
                    onBlur={that.validate}
                    className={that.props.className}
                    onFocus={that.props.onFocus}
                    ref={that.props.inputRef}
                />
                <div className="warning-message">{that.state.warning ? that.state.warning : ''}</div>
            </div>
        );
    }
});

module.exports = Input;