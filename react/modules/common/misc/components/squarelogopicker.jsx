require('./styles.css');

var Misc = require('../index');

module.exports = React.createClass({
    componentWillMount: function() {
        Misc.initPhotoManager.preload();
    },
    getDefaultProps: function() {
        return {
            onChange: function(url) {}
        };
    },
    render: function() {
        var props = this.props;
        var that = this;

        return (
            <div className={"square-avatar-picker square-logo-picker" + (props.url ? ' trans-bg' : '')}
                onClick={function(e) {
                    if (that.clearLogoBtn && that.clearLogoBtn.contains(e.target)) return;
                    Misc.initPhotoManager(function(err, img) {
                        if (err) return console.warn(err);
                        props.onChange(img.url);
                    });
                }}
            >
                {(function() {
                    if (props.url) return [
                        <div style={{
                            width: '100%', height: '100%',
                            background: 'url(' + props.url + ') center center / contain no-repeat'
                        }}></div>,
                        <div className="clear-btn" data-tooltip="Bỏ chọn" 
                            ref={function(e) { that.clearLogoBtn = e; }}
                            onClick={function() {
                                props.onChange('');
                            }}
                        >✖</div>
                    ];

                    return (
                        <i className="fa fa-plus-circle"></i>
                    );
                })()}
            </div>
        );
    }
});