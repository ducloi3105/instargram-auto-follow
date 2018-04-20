require('./styles.css');

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            className: '',
            checked: false,
            onChange: function(checked) {},
            checkboxRef: function(e) {/* self.flipSwitch = e; console.log(self.flipSwitch.checked); */}
        };
    },
    getInitialState: function() {
        return {
            checked: this.props.checked
        };
    },
    componentWillReceiveProps: function(nextProps) {
        var props = this.props;
        if (nextProps.checked !== props.checked) {
            this.setState({ checked: nextProps.checked });
        }
    },
    render: function() {
        var props = this.props;
        var that = this;
        var onClick = function() {
            that.setState({ checked: !that.state.checked }, function() {
                props.onChange(that.state.checked);
            });
        };
        var className = this.state.checked ? 'on ' : 'off ';
        className += props.className;
        return (
            <div className={'jsx-flipswitch ' + className} onClick={onClick}>
                <i></i>
                <input type="checkbox" className="display-none" checked={that.state.checked} ref={props.checkboxRef}/>
            </div>
        );
    }
});