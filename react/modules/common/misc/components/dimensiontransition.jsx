/**********
    <DimensionTransition className="something">
        <p>something</p>
        <p>something else</p>
    </DimensionTransition>
***********/

var Misc = require('../functions');

var DimensionTransition = React.createClass({
    getDefaultProps: function() {
        return {
            className: '',
            children: null
        };
    },
    getInitialState: function() {
        this.tokens = Misc.tokensConstructor();
        return { style: {}, children: this.props.children, transitioning: false };
    },
    getCssDuration: function() {
        try {
            var duration = parseFloat(getComputedStyle(this.main)['transitionDuration']) * 1000;
            if (isNaN(duration)) throw ' ';
            return duration;
        } catch (err) {
            return 0;
        }
    },
    componentWillUnmount: function() {
        this.tokens.new('animation');
    },
    componentWillReceiveProps: function(nextProps) {
        var that = this;
        var thisProps = this.props;
        var thisChildren = this.props.children || [];
        var nextChildren = nextProps.children || [];
        // var oldKeys = thisChildren.map(function(child) { return child.key; });
        // var newKeys = nextChildren.map(function(child) { return child.key; });
        // if (JSON.stringify(oldKeys) === JSON.stringify(newKeys)) return;
        var token = this.tokens.new('animation');
        that.setState({ style: {}, transitioning: false }, function() {
            if (!token.isStillValid()) return;
            // set về mặc định để lấy current width height
            var currentWidth = that.main.offsetWidth;
            var currentHeight = that.main.offsetHeight;
            that.setState({ children: nextProps.children }, function() {
                if (!token.isStillValid()) return;
                // chuyển sang children mới để lấy width height mới để transition
                var nextWidth = that.main.offsetWidth;
                var nextHeight = that.main.offsetHeight;
                if (currentWidth === nextWidth && currentHeight === nextHeight) return;
                that.setState({
                    style: { width: currentWidth, height: currentHeight },
                    transitioning: true
                }, function() {
                    // quay trở lại width height ban đầu + setTimeout để browser nhận width height -> bắt đầu transition
                    setTimeout(function() {
                        if (!token.isStillValid()) return;
                        that.setState({
                            style: { width: nextWidth, height: nextHeight }
                        }, function() {
                            // set width height mới -> transition từ width height cũ -> mới
                            setTimeout(function() {
                                if (!token.isStillValid()) return;
                                // sau khi transition xong -> bỏ width height cứng -> quay lại auto
                                that.setState({ style: {}, transitioning: false });
                            }, that.getCssDuration());
                        });
                    }, 20); // 20ms ~ 1 frame
                });
            });
        });
    },
    render: function() {
        var props = this.props;
        var state = this.state;
        var classNames = [props.className];
        if (state.transitioning) classNames.push('dimension-transitioning');
        var that = this;
        return (
            <div className={classNames.join(' ')} style={state.style} ref={function(e) { that.main = e; }}>
                {state.children}
            </div>
        );
    }
});

module.exports = DimensionTransition;