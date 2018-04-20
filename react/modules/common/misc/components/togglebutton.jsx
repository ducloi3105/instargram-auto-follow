require('./styles.css');

module.exports = function(props) {
    var onChange = props.onChange || function() {};
    var Icon = props.icon || '';
    var text = props.text || 'Button';
    var className = props.className || '';
    var isActive = props.isActive;
    className += ' noselect jsx-toggle-btn';
    if (isActive) className += ' active';
    return (
        <div className={className} onClick={function() {
            onChange(!isActive);
        }}>
            {Icon}
            <span>{text}</span>
        </div>
    );
};