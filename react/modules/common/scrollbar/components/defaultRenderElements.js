import utils  from "../utils";
import React from 'react'

module.exports = {
    renderViewDefault: function (props) {
        return React.createElement("div", props);
    },

    renderTrackHorizontalDefault: function (_ref) {
        var style = _ref.style,
            props = utils.objectWithoutProperties(_ref, ['style']);
        var finalStyle = Object.assign({}, style, { right: 2, bottom: 2, left: 2, borderRadius: 3 });
        return React.createElement('div', Object.assign({ style: finalStyle }, props));
    },

    renderTrackVerticalDefault: function (_ref) {
        var style = _ref.style,
            props = utils.objectWithoutProperties(_ref, ['style']);
        var finalStyle = Object.assign({}, style, { right: 0, bottom: 2, top: 2, borderRadius: 3 });
        return React.createElement('div', Object.assign({ style: finalStyle }, props));
    },

    renderThumbHorizontalDefault: function (_ref) {
        var style = _ref.style,
            props = utils.objectWithoutProperties(_ref, ['style']);
        var finalStyle = Object.assign({}, style, { cursor: 'pointer', borderRadius: 'inherit', backgroundColor: 'rgba(0,0,0,.2)' });
        return React.createElement('div', Object.assign({ style: finalStyle }, props));
    },

    renderThumbVerticalDefault: function (_ref) {
        var style = _ref.style,
            props = utils.objectWithoutProperties(_ref, ['style']);
            
        var finalStyle = Object.assign({}, style, { cursor: 'pointer', borderRadius: 'inherit', backgroundColor: 'rgba(0,0,0,.2)' });
        return React.createElement('div', Object.assign({ style: finalStyle }, props));
    }
};
