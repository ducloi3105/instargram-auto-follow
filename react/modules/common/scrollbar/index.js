import React, { Component } from 'react';
import PropTypes from 'prop-types';
var utils = require('./utils');
var styles = require('./components/styles');
var defaultRender = require('./components/defaultRenderElements');
var raf = require('raf');
var caf = raf.cancel;

class Scrollbars extends Component {
    constructor(props) {
        super(props);
        this.state = {
            didMountUniversal: false
        }
        this.getScrollLeft = this.getScrollLeft.bind(this)
        this.getScrollTop = this.getScrollTop.bind(this)
        this.getScrollWidth = this.getScrollWidth.bind(this)
        this.getScrollHeight = this.getScrollHeight.bind(this)
        this.getClientWidth = this.getClientWidth.bind(this)
        this.getClientHeight = this.getClientHeight.bind(this)
        this.getValues = this.getValues.bind(this)
        this.getThumbHorizontalWidth = this.getThumbHorizontalWidth.bind(this)
        this.getThumbVerticalHeight = this.getThumbVerticalHeight.bind(this)
        this.getScrollLeftForOffset = this.getScrollLeftForOffset.bind(this)
        this.getScrollTopForOffset = this.getScrollTopForOffset.bind(this)
        this.scrollLeft = this.scrollLeft.bind(this)
        this.scrollTop = this.scrollTop.bind(this)
        this.scrollToLeft = this.scrollToLeft.bind(this)
        this.scrollToTop = this.scrollToTop.bind(this)
        this.scrollToRight = this.scrollToRight.bind(this)
        this.scrollToBottom = this.scrollToBottom.bind(this)
        this.addListeners = this.addListeners.bind(this)
        this.removeListeners = this.removeListeners.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
        this.handleScrollStart = this.handleScrollStart.bind(this)
        this.handleScrollStartAutoHide = this.handleScrollStartAutoHide.bind(this)
        this.handleScrollStop = this.handleScrollStop.bind(this)
        this.handleScrollStopAutoHide = this.handleScrollStopAutoHide.bind(this)
        this.handleWindowResize = this.handleWindowResize.bind(this)
        this.handleHorizontalTrackMouseDown = this.handleHorizontalTrackMouseDown.bind(this)
        this.handleVerticalTrackMouseDown = this.handleVerticalTrackMouseDown.bind(this)
        this.handleHorizontalThumbMouseDown = this.handleHorizontalThumbMouseDown.bind(this)
        this.handleVerticalThumbMouseDown = this.handleVerticalThumbMouseDown.bind(this)
        this.setupDragging = this.setupDragging.bind(this)
        this.teardownDragging = this.teardownDragging.bind(this)
        this.handleDragStart = this.handleDragStart.bind(this)
        this.handleDrag = this.handleDrag.bind(this)
        this.handleDragEnd = this.handleDragEnd.bind(this)
        this.handleDragEndAutoHide = this.handleDragEndAutoHide.bind(this)
        this.handleTrackMouseEnter = this.handleTrackMouseEnter.bind(this)
        this.handleTrackMouseEnterAutoHide = this.handleTrackMouseEnterAutoHide.bind(this)
        this.handleTrackMouseLeave = this.handleTrackMouseLeave.bind(this)
        this.handleTrackMouseLeaveAutoHide = this.handleTrackMouseLeaveAutoHide.bind(this)
        this.showTracks = this.showTracks.bind(this)
        this.hideTracks = this.hideTracks.bind(this)
        this.detectScrolling = this.detectScrolling.bind(this)
        this.update = this.update.bind(this)
        this._update = this._update.bind(this)
    }
    componentDidMount() {
        this.addListeners();
        this.update();
        this.componentDidMountUniversal();
    }

    componentDidMountUniversal() { // eslint-disable-line react/sort-comp
        var universal = this.props.universal;
        if (!universal) return;
        this.setState({ didMountUniversal: true });
    }

    componentDidUpdate() {
        this.update();
    }

    componentWillUnmount() {
        this.removeListeners();
        caf(this.requestFrame);
        clearTimeout(this.hideTracksTimeout);
        clearInterval(this.detectScrollingInterval);
    }

    getScrollLeft() {
        return this.view.scrollLeft;
    }

    getScrollTop() {
        return this.view.scrollTop;
    }

    getScrollWidth() {
        return this.view.scrollWidth;
    }

    getScrollHeight() {
        return this.view.scrollHeight;
    }

    getClientWidth() {
        return this.view.clientWidth;
    }

    getClientHeight() {
        return this.view.clientHeight;
    }

    getValues() {
        var _view = this.view,
            scrollLeft = _view.scrollLeft,
            scrollTop = _view.scrollTop,
            scrollWidth = _view.scrollWidth,
            scrollHeight = _view.scrollHeight,
            clientWidth = _view.clientWidth,
            clientHeight = _view.clientHeight;


        return {
            left: scrollLeft / (scrollWidth - clientWidth) || 0,
            top: scrollTop / (scrollHeight - clientHeight) || 0,
            scrollLeft: scrollLeft,
            scrollTop: scrollTop,
            scrollWidth: scrollWidth,
            scrollHeight: scrollHeight,
            clientWidth: clientWidth,
            clientHeight: clientHeight
        };
    }

    getThumbHorizontalWidth() {
        var _props = this.props,
            thumbSize = _props.thumbSize,
            thumbMinSize = _props.thumbMinSize;
        var _view = this.view,
            scrollWidth = _view.scrollWidth,
            clientWidth = _view.clientWidth;

        var trackWidth = utils.getInnerWidth(this.trackHorizontal);
        var width = Math.ceil(clientWidth / scrollWidth * trackWidth);
        if (trackWidth === width) return 0;
        if (thumbSize) return thumbSize;
        return Math.max(width, thumbMinSize);
    }

    getThumbVerticalHeight() {
        var _props = this.props,
            thumbSize = _props.thumbSize,
            thumbMinSize = _props.thumbMinSize;
        var _view = this.view,
            scrollHeight = _view.scrollHeight,
            clientHeight = _view.clientHeight;
        var trackHeight = utils.getInnerHeight(this.trackVertical);
        var height = Math.ceil(clientHeight / scrollHeight * trackHeight);
        if (trackHeight === height) return 0;
        if (thumbSize) return thumbSize;
        return Math.max(height, thumbMinSize);
    }

    getScrollLeftForOffset(offset) {
        var _view = this.view,
            scrollWidth = _view.scrollWidth,
            clientWidth = _view.clientWidth;

        var trackWidth = utils.getInnerWidth(this.trackHorizontal);
        var thumbWidth = this.getThumbHorizontalWidth();
        return offset / (trackWidth - thumbWidth) * (scrollWidth - clientWidth);
    }

    getScrollTopForOffset(offset) {
        var _view = this.view,
            scrollHeight = _view.scrollHeight,
            clientHeight = _view.clientHeight;

        var trackHeight = utils.getInnerHeight(this.trackVertical);
        var thumbHeight = this.getThumbVerticalHeight();
        return offset / (trackHeight - thumbHeight) * (scrollHeight - clientHeight);
    }

    scrollLeft() {
        var left = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        this.view.scrollLeft = left;
    }

    scrollTop() {
        var top = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        this.view.scrollTop = top;
    }

    scrollToLeft() {
        this.view.scrollLeft = 0;
    }

    scrollToTop() {
        this.view.scrollTop = 0;
    }

    scrollToRight() {
        this.view.scrollLeft = this.view.scrollWidth;
    }

    scrollToBottom() {
        this.view.scrollTop = this.view.scrollHeight;
    }

    addListeners() {
        if (typeof document === 'undefined') return;
        var view = this.view,
            trackHorizontal = this.trackHorizontal,
            trackVertical = this.trackVertical,
            thumbHorizontal = this.thumbHorizontal,
            thumbVertical = this.thumbVertical;

        view.addEventListener('scroll', this.handleScroll);
        if (!utils.getScrollbarWidth()) return;
        trackHorizontal.addEventListener('mouseenter', this.handleTrackMouseEnter);
        trackHorizontal.addEventListener('mouseleave', this.handleTrackMouseLeave);
        trackHorizontal.addEventListener('mousedown', this.handleHorizontalTrackMouseDown);
        trackVertical.addEventListener('mouseenter', this.handleTrackMouseEnter);
        trackVertical.addEventListener('mouseleave', this.handleTrackMouseLeave);
        trackVertical.addEventListener('mousedown', this.handleVerticalTrackMouseDown);
        thumbHorizontal.addEventListener('mousedown', this.handleHorizontalThumbMouseDown);
        thumbVertical.addEventListener('mousedown', this.handleVerticalThumbMouseDown);
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', this.handleWindowResize);
        }
    }

    removeListeners() {
        /* istanbul ignore if */
        if (typeof document === 'undefined') return;
        var view = this.view,
            trackHorizontal = this.trackHorizontal,
            trackVertical = this.trackVertical,
            thumbHorizontal = this.thumbHorizontal,
            thumbVertical = this.thumbVertical;

        if (typeof view !== 'undefined')
            view.removeEventListener('scroll', this.handleScroll);

        if (!utils.getScrollbarWidth()) return;

        if (trackHorizontal) {
            trackHorizontal.removeEventListener('mouseenter', this.handleTrackMouseEnter);
            trackHorizontal.removeEventListener('mouseleave', this.handleTrackMouseLeave);
            trackHorizontal.removeEventListener('mousedown', this.handleHorizontalTrackMouseDown);
        }
        if (trackVertical) {
            trackVertical.removeEventListener('mouseenter', this.handleTrackMouseEnter);
            trackVertical.removeEventListener('mouseleave', this.handleTrackMouseLeave);
            trackVertical.removeEventListener('mousedown', this.handleVerticalTrackMouseDown);
        }
        if (trackVertical) {
            trackVertical.removeEventListener('mousedown', this.handleHorizontalThumbMouseDown);
        }
        if (thumbVertical) {
            thumbVertical.removeEventListener('mousedown', this.handleVerticalThumbMouseDown);
        }
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.handleWindowResize);
        }
        // Possibly setup by `handleDragStart`
        this.teardownDragging();
    }

    handleScroll(event) {
        var self = this;

        var _props = this.props,
            onScroll = _props.onScroll,
            onScrollFrame = _props.onScrollFrame;

        if (onScroll) onScroll(event);
        this.update(function (values) {
            var scrollLeft = values.scrollLeft,
                scrollTop = values.scrollTop;
            self.viewScrollLeft = scrollLeft;
            self.viewScrollTop = scrollTop;
            if (onScrollFrame) onScrollFrame(values);
        });
        this.detectScrolling();
    }

    handleScrollStart() {
        var onScrollStart = this.props.onScrollStart;

        if (onScrollStart) onScrollStart();
        this.handleScrollStartAutoHide();
    }

    handleScrollStartAutoHide() {
        var autoHide = this.props.autoHide;
        if (!autoHide) return;
        this.showTracks();
    }

    handleScrollStop() {
        var onScrollStop = this.props.onScrollStop;
        if (onScrollStop) onScrollStop();
        this.handleScrollStopAutoHide();
    }

    handleScrollStopAutoHide() {
        var autoHide = this.props.autoHide;
        if (!autoHide) return;
        this.hideTracks();
    }

    handleWindowResize() {
        this.update();
    }

    handleHorizontalTrackMouseDown(event) {
        event.preventDefault();
        var target = event.target,
            clientX = event.clientX;

        var _targetBounding = target.getBoundingClientRect(),
            targetLeft = _targetBounding.left;

        var thumbWidth = this.getThumbHorizontalWidth();
        var offset = Math.abs(targetLeft - clientX) - thumbWidth / 2;
        this.view.scrollLeft = this.getScrollLeftForOffset(offset);
    }

    handleVerticalTrackMouseDown(event) {
        event.preventDefault();
        var target = event.target,
            clientY = event.clientY;

        var _targetBounding = target.getBoundingClientRect(),
            targetTop = _targetBounding.top;

        var thumbHeight = this.getThumbVerticalHeight();
        var offset = Math.abs(targetTop - clientY) - thumbHeight / 2;
        this.view.scrollTop = this.getScrollTopForOffset(offset);
    }

    handleHorizontalThumbMouseDown(event) {
        event.preventDefault();
        this.handleDragStart(event);
        var target = event.target,
            clientX = event.clientX;
        var offsetWidth = target.offsetWidth;

        var _targetBounding = target.getBoundingClientRect(),
            left = _targetBounding.left;
        this.prevPageX = offsetWidth - (clientX - left);
    }

    handleVerticalThumbMouseDown(event) {
        event.preventDefault();

        this.handleDragStart(event);
        var target = event.target,
            clientY = event.clientY;
        var offsetHeight = target.offsetHeight;

        var _targetBounding = target.getBoundingClientRect(),
            top = _targetBounding.top;
        this.prevPageY = offsetHeight - (clientY - top);
    }

    setupDragging() {
        utils.css(document.body, styles.disableSelectStyle);
        document.addEventListener('mousemove', this.handleDrag);
        document.addEventListener('mouseup', this.handleDragEnd);
        document.onselectstart = utils.returnFalse;
    }

    teardownDragging() {
        utils.css(document.body, styles.disableSelectStyleReset);
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.handleDragEnd);
        document.onselectstart = undefined;
    }

    handleDragStart(event) {
        this.dragging = true;
        event.stopImmediatePropagation();
        this.setupDragging();
    }

    handleDrag(event) {
        if (this.prevPageX) {
            var clientX = event.clientX;

            var _trackHorizontalBounding = this.trackHorizontal.getBoundingClientRect(),
                trackLeft = _trackHorizontalBounding.left;
            var thumbWidth = this.getThumbHorizontalWidth();
            var clickPosition = thumbWidth - this.prevPageX;
            var offset = -trackLeft + clientX - clickPosition;
            this.view.scrollLeft = this.getScrollLeftForOffset(offset);
        }
        if (this.prevPageY) {
            var clientY = event.clientY;

            var _trackVerticalBounding = this.trackVertical.getBoundingClientRect(),
                trackTop = _trackVerticalBounding.top;
            var thumbHeight = this.getThumbVerticalHeight();
            var clickPosition = thumbHeight - this.prevPageY;
            var offset = -trackTop + clientY - clickPosition;
            this.view.scrollTop = this.getScrollTopForOffset(offset);
        }
        return false;
    }

    handleDragEnd() {
        this.dragging = false;
        this.prevPageX = this.prevPageY = 0;
        this.teardownDragging();
        this.handleDragEndAutoHide();
    }

    handleDragEndAutoHide() {
        var autoHide = this.props.autoHide;
        if (!autoHide) return;
        this.hideTracks();
    }

    handleTrackMouseEnter() {
        this.trackMouseOver = true;
        this.handleTrackMouseEnterAutoHide();
    }

    handleTrackMouseEnterAutoHide() {
        var autoHide = this.props.autoHide;
        if (!autoHide) return;
        this.showTracks();
    }

    handleTrackMouseLeave() {
        this.trackMouseOver = false;
        this.handleTrackMouseLeaveAutoHide();
    }

    handleTrackMouseLeaveAutoHide() {
        var autoHide = this.props.autoHide;
        if (!autoHide) return;
        this.hideTracks();
    }

    showTracks() {
        clearTimeout(this.hideTracksTimeout);
        utils.css(this.trackHorizontal, { opacity: 1 });;
        utils.css(this.trackVertical, { opacity: 1 });
    }

    hideTracks() {
        if (this.dragging) return;
        if (this.scrolling) return;
        if (this.trackMouseOver) return;
        var autoHideTimeout = this.props.autoHideTimeout;
        var self = this;
        clearTimeout(this.hideTracksTimeout);
        this.hideTracksTimeout = setTimeout(function () {
            utils.css(self.trackHorizontal, { opacity: 0 });
            utils.css(self.trackVertical, { opacity: 0 });
        }, autoHideTimeout);
    }

    detectScrolling() {
        if (this.scrolling) return;
        var self = this;
        this.scrolling = true;
        this.handleScrollStart();
        this.detectScrollingInterval = setInterval(function () {
            if (self.lastViewScrollLeft === self.viewScrollLeft && self.lastViewScrollTop === self.viewScrollTop) {
                clearInterval(self.detectScrollingInterval);
                self.scrolling = false;
                self.handleScrollStop();
            }
            self.lastViewScrollLeft = self.viewScrollLeft;
            self.lastViewScrollTop = self.viewScrollTop;
        }, 100);
    }

    raf(callback) {
        var self = this;
        if (this.requestFrame) raf.cancel(this.requestFrame);
        this.requestFrame = raf(function () {
            self.requestFrame = undefined;
            callback();
        });
    }

    update(callback) {
        var self = this;
        this.raf(function () { self._update(callback) });
    }

    _update(callback) {
        var _props = this.props,
            onUpdate = _props.onUpdate,
            hideTracksWhenNotNeeded = _props.hideTracksWhenNotNeeded;

        var values = this.getValues();

        if (utils.getScrollbarWidth()) {
            var scrollLeft = values.scrollLeft,
                clientWidth = values.clientWidth,
                scrollWidth = values.scrollWidth;
            var trackHorizontalWidth = utils.getInnerWidth(this.trackHorizontal);
            var thumbHorizontalWidth = this.getThumbHorizontalWidth();
            var thumbHorizontalX = scrollLeft / (scrollWidth - clientWidth) * (trackHorizontalWidth - thumbHorizontalWidth);
            var thumbHorizontalStyle = {
                width: thumbHorizontalWidth,
                transform: 'translateX(' + thumbHorizontalX + 'px)'
            };
            var scrollTop = values.scrollTop,
                clientHeight = values.clientHeight,
                scrollHeight = values.scrollHeight;
            var trackVerticalHeight = utils.getInnerHeight(this.trackVertical);
            var thumbVerticalHeight = this.getThumbVerticalHeight();
            var thumbVerticalY = scrollTop / (scrollHeight - clientHeight) * (trackVerticalHeight - thumbVerticalHeight);
            var thumbVerticalStyle = {
                height: thumbVerticalHeight,
                transform: 'translateY(' + thumbVerticalY + 'px)'
            };
            if (hideTracksWhenNotNeeded) {
                var trackHorizontalStyle = {
                    visibility: scrollWidth > clientWidth ? 'visible' : 'hidden'
                };
                var trackVerticalStyle = {
                    visibility: scrollHeight > clientHeight ? 'visible' : 'hidden'
                };
                utils.css(this.trackHorizontal, trackHorizontalStyle);
                utils.css(this.trackVertical, trackVerticalStyle);
            }
            utils.css(this.thumbHorizontal, thumbHorizontalStyle);
            utils.css(this.thumbVertical, thumbVerticalStyle);
        }
        if (onUpdate) onUpdate(values);
        if (typeof callback !== 'function') return;
        callback(values);
    }

    render() {
        var scrollbarWidth = utils.getScrollbarWidth();
        var self = this;
        var _props = this.props,
            onScroll = _props.onScroll,
            onScrollFrame = _props.onScrollFrame,
            onScrollStart = _props.onScrollStart,
            onScrollStop = _props.onScrollStop,
            onUpdate = _props.onUpdate,
            renderView = _props.renderView,
            renderTrackHorizontal = _props.renderTrackHorizontal,
            renderTrackVertical = _props.renderTrackVertical,
            renderThumbHorizontal = _props.renderThumbHorizontal,
            renderThumbVertical = _props.renderThumbVertical,
            tagName = _props.tagName,
            hideTracksWhenNotNeeded = _props.hideTracksWhenNotNeeded,
            autoHide = _props.autoHide,
            autoHideTimeout = _props.autoHideTimeout,
            autoHideDuration = _props.autoHideDuration,
            thumbSize = _props.thumbSize,
            thumbMinSize = _props.thumbMinSize,
            universal = _props.universal,
            autoHeight = _props.autoHeight,
            autoHeightMin = _props.autoHeightMin,
            autoHeightMax = _props.autoHeightMax,
            style = _props.style,
            children = _props.children,
            props = utils.objectWithoutProperties(_props, ['onScroll', 'onScrollFrame', 'onScrollStart', 'onScrollStop', 'onUpdate', 'renderView', 'renderTrackHorizontal', 'renderTrackVertical', 'renderThumbHorizontal', 'renderThumbVertical', 'tagName', 'hideTracksWhenNotNeeded', 'autoHide', 'autoHideTimeout', 'autoHideDuration', 'thumbSize', 'thumbMinSize', 'universal', 'autoHeight', 'autoHeightMin', 'autoHeightMax', 'style', 'children']);


        var didMountUniversal = this.state.didMountUniversal;

        var containerStyle = Object.assign({}, styles.containerStyleDefault, autoHeight && Object.assign({}, styles.containerStyleAutoHeight, {
            minHeight: autoHeightMin,
            maxHeight: autoHeightMax
        }), style);

        var viewStyle = Object.assign({}, styles.viewStyleDefault, {
            // Hide scrollbars by setting a negative margin
            marginRight: scrollbarWidth ? -scrollbarWidth : 0,
            marginBottom: scrollbarWidth ? -scrollbarWidth : 0
        }, autoHeight && Object.assign({}, styles.viewStyleAutoHeight, {
            // Add scrollbarWidth to autoHeight in order to compensate negative margins
            minHeight: utils.isString(autoHeightMin) ? 'calc(' + autoHeightMin + ' + ' + scrollbarWidth + 'px)' : autoHeightMin + scrollbarWidth,
            maxHeight: utils.isString(autoHeightMax) ? 'calc(' + autoHeightMax + ' + ' + scrollbarWidth + 'px)' : autoHeightMax + scrollbarWidth
        }), autoHeight && universal && !didMountUniversal && {
            minHeight: autoHeightMin,
            maxHeight: autoHeightMax
        }, universal && !didMountUniversal && styles.viewStyleUniversalInitial);

        var trackAutoHeightStyle = {
            transition: 'opacity ' + autoHideDuration + 'ms',
            opacity: 0
        };

        var trackHorizontalStyle = Object.assign({}, styles.trackHorizontalStyleDefault, autoHide && trackAutoHeightStyle, (!scrollbarWidth || universal && !didMountUniversal) && {
            display: 'none'
        });

        var trackVerticalStyle = Object.assign({}, styles.trackVerticalStyleDefault, autoHide && trackAutoHeightStyle, (!scrollbarWidth || universal && !didMountUniversal) && {
            display: 'none'
        });

        return React.createElement(tagName, Object.assign({ className: "scroll-wrapper" }, props, {
            style: containerStyle, ref(_ref1) {
                self.container = _ref1;
            }
        }), [
                React.cloneElement(
                    renderView({ style: viewStyle }),
                    { key: 'view', className: "scroll-wrapper-view", ref(el) { self.view = el; } },
                    children
                ),
                React.cloneElement(
                    renderTrackHorizontal({ style: trackHorizontalStyle }),
                    { key: 'trackHorizontal', ref(el) { self.trackHorizontal = el; } },
                    React.cloneElement(
                        renderThumbHorizontal({ style: styles.thumbHorizontalStyleDefault }),
                        { ref(el) { self.thumbHorizontal = el; } }
                    )
                ),
                React.cloneElement(
                    renderTrackVertical({ style: trackVerticalStyle }),
                    { key: 'trackVertical', ref(el) { self.trackVertical = el; } },
                    React.cloneElement(
                        renderThumbVertical({ style: styles.thumbVerticalStyleDefault }),
                        { ref(el) { self.thumbVertical = el; } }
                    )
                )
            ]);
    }
}
Scrollbars.propTypes = {
    onScroll: PropTypes.func,
    onScrollFrame: PropTypes.func,
    onScrollStart: PropTypes.func,
    onScrollStop: PropTypes.func,
    onUpdate: PropTypes.func,
    renderView: PropTypes.func,
    renderTrackHorizontal: PropTypes.func,
    renderTrackVertical: PropTypes.func,
    renderThumbHorizontal: PropTypes.func,
    renderThumbVertical: PropTypes.func,
    tagName: PropTypes.string,
    thumbSize: PropTypes.number,
    thumbMinSize: PropTypes.number,
    hideTracksWhenNotNeeded: PropTypes.bool,
    autoHide: PropTypes.bool,
    autoHideTimeout: PropTypes.number,
    autoHideDuration: PropTypes.number,
    autoHeight: PropTypes.bool,
    autoHeightMin: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    autoHeightMax: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    universal: PropTypes.bool,
    style: PropTypes.object,
    children: PropTypes.node,
}
Scrollbars.defaultProps = {
    renderView: defaultRender.renderViewDefault,
    renderTrackHorizontal: defaultRender.renderTrackHorizontalDefault,
    renderTrackVertical: defaultRender.renderTrackVerticalDefault,
    renderThumbHorizontal: defaultRender.renderThumbHorizontalDefault,
    renderThumbVertical: defaultRender.renderThumbVerticalDefault,
    tagName: 'div',
    thumbMinSize: 30,
    hideTracksWhenNotNeeded: false,
    autoHide: false,
    autoHideTimeout: 1000,
    autoHideDuration: 200,
    autoHeight: false,
    autoHeightMin: 0,
    autoHeightMax: 200,
    universal: false,
};
export default Scrollbars;