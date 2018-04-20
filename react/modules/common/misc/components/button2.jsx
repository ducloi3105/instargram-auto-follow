require('./styles.css');

module.exports = function(props) {
    var onClick = props.onClick || function() {};
    var text = props.text || 'Button';
    var className = props.className || '';
    className += ' jsx-btn-2';
    if (props.disabled) {
        onClick = function() {};
        className += ' disabled';
    }
    return (
        <input type="text" className={className} type="submit" onClick={onClick} value={text}/>
    );
};