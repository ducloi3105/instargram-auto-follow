require('./styles.css');

module.exports = function(props) {
    var onClick = props.onClick || function() {};
    var Icon = props.icon || '';
    var text = props.text || 'Button';
    var className = props.className || '';
    className += ' jsx-btn';
    if (props.disabled) {
        onClick = function() {};
        className += ' disabled';
    }
    return (
        <div className={className} onClick={onClick}>
            {Icon}
            <span>{text}</span>
        </div>
    );
};