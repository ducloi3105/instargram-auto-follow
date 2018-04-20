/********************
    !!! phải bọc xung quanh 1 element để lấy được vị trí render !!!

    <SuggestPanel
        suggestions={[{ avatar: '...', name: '...', description: '...', value: '...', _extra: '...' }]}
        onChoose={function(item) {}}
        showSuggestions={true}
        className=""
        onClickOutside={function() {}}
        isLoading={true}
        onEmptyShowComponent={<CustomElement></CustomElement>}
        onLoadingShowComponent={<CustomLoading></CustomLoading>}
        footerComponent={<CustomFooter></CustomFooter>}
        maxHeight={350}
    >
        <input type="text"/>
    </SuggestPanel>
********************/

var Helper = require('../../helper');
var Scrollbar = require('../../scrollbar');
var Loading = require('../../loading-overlay');
require('./styles.css');

var Item = function(props) {
    var item = props.item;
    return (
        <div className="jsx-suggest-item" onClick={props.onClick}>
            {typeof item.avatar != 'undefined' ? <div className="avatar">
                {(function() {
                    if (item.avatar) return (
                        <div style={{
                            background: 'url(' + Helper.thumbImage(item.avatar, 60, 60) + ') center center / cover no-repeat',
                            width: '100%', height: '100%'
                        }}></div>
                    );
                })()}
            </div>: null}
            <div className="info">
                <div className="title">{item.name || ''}</div>
                <div className="description">{item.description || ''}</div>
            </div>
        </div>
    );
};

var SuggestPanel = React.createClass({
    getInitialState: function() {
        return {};
    },
    componentDidMount: function() {
        window.addEventListener('click', this.windowOnClick);
    },
    componentWillUnmount: function() {
        window.removeEventListener('click', this.windowOnClick);
    },
    windowOnClick: function(e) {
        // this.setScrollbarDimension();
        if (this.suggestPanel.contains(e.target)) return;
        this.props.onClickOutside();
    },
    getDefaultProps: function() {
        return {
            suggestions: [],
            onChoose: function(item) {},
            showSuggestions: false,
            className: '',
            onClickOutside: function() {},
            isLoading: false,
            onEmptyShowComponent: null,
            onLoadingShowComponent: null,
            footerComponent: null,
            maxHeight: 350,
            panelMarginTop: 80,
            panelMarginBottom: 80
        };
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.props.suggestions.length !== nextProps.suggestions.length || 
            (this.props.suggestions && this.props.showSuggestions !== nextProps.showSuggestions) ||
            this.props.isLoading !== nextProps.isLoading) {
            this.setScrollbarDimension();
        }
    },
    calculateAvailableSpace: function(inputWrapperRef, callback) {
        var PADDING_TOP = isNaN(parseInt(this.props.panelMarginTop)) ? 80 : parseInt(this.props.panelMarginTop);
        var PADDING_BOTTOM = isNaN(parseInt(this.props.panelMarginBottom)) ? 80 : parseInt(this.props.panelMarginBottom);
        var MAX_HEIGHT = isNaN(parseInt(this.props.maxHeight)) ? 350 : parseInt(this.props.maxHeight);
        try {
            var inputRect = inputWrapperRef.getBoundingClientRect();
            var windowHeight = window.innerHeight;
        } catch (err) {}
        var topSpace = inputRect.top - 0 - PADDING_TOP;
        var bottomSpace = windowHeight - inputRect.bottom - PADDING_BOTTOM;
        var shouldBeUp = topSpace - bottomSpace > 0;
        var availableHeight = topSpace > bottomSpace ? topSpace : bottomSpace;
        // availableHeight -= shouldBeUp ? PADDING_TOP : PADDING_BOTTOM;
        if (availableHeight < 0) availableHeight = 0;
        if (availableHeight > MAX_HEIGHT) availableHeight = MAX_HEIGHT;
        callback(shouldBeUp, availableHeight);
    },
    setScrollbarDimension: function() {
        var self = this;
        clearTimeout(self.timeout);
        self.timeout = setTimeout(function() {
            try {
                self.calculateAvailableSpace(self.suggestPanel, function(shouldBeUp, maxHeight) {
                    var height = self.suggestionsPanel.offsetHeight + 2;
                    if (height > maxHeight) height = maxHeight;
                    if (height === self.state.scrollbarHeight && !!shouldBeUp === !!self.state.directionIsUp) return;
                    self.setState({ scrollbarHeight: height, directionIsUp: !!shouldBeUp });
                });
            } catch (err) {}
        }, 0);
    },
    render: function() {
        var self = this;
        return (
            <div 
                className={(function() {
                    var classes = ['jsx-suggest-panel'];
                    if (self.props.className) classes.push(self.props.className);
                    if (self.state.directionIsUp) classes.push('upside-down');
                    return classes.join(' ');
                })()}
                ref={function(e) { self.suggestPanel = e; }}
            >

                {self.props.children}

                <div className={"jsx-suggest-wrapper" + (self.props.showSuggestions ? '' : ' invisible')}
                    style={self.state.directionIsUp ? { bottom: '100%' } : null}>
                    {(function() {
                        if (self.props.isLoading) {
                            if (self.props.onLoadingShowComponent) return self.props.onLoadingShowComponent;
                            return (
                                <pre className="suggestion-empty">
                                    Đang tìm kiếm <i className="fa fa-cog fa-spin"></i>
                                </pre>
                            );
                        }
                        return (
                            <Scrollbar className="jsx-suggest-scrollbar" style={{ height: self.state.scrollbarHeight }}>
                                <div className={'jsx-suggest-suggestions'}
                                    ref={function(e) { self.suggestionsPanel = e; }}
                                >
                                    {(function(suggestions) {
                                        if (!suggestions.length) {
                                            if (self.props.onEmptyShowComponent) return self.props.onEmptyShowComponent;
                                            return <pre className="suggestion-empty">Không có kết quả</pre>;
                                        }
                                        return suggestions.map(function(item) {
                                            return <Item item={item} onClick={function() {
                                                self.props.onChoose(item);
                                            }}></Item>;
                                        });
                                    })(self.props.suggestions)}
                                </div>
                            </Scrollbar>
                        );
                    })()}

                    {self.props.footerComponent}

                </div>
                <span className={"jsx-arrow" + (self.props.showSuggestions ? '' : ' invisible')}></span>
                <span className={"jsx-arrow jsx-arrow-border" + (self.props.showSuggestions ? '' : ' invisible')}></span>
            </div>
        );
    }
});

module.exports = SuggestPanel;