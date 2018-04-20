// fallback when window.React or window.ReactDOM is missing

var obj = {
    React: {
        createClass: function() {},
        createElement: function() {},
        cloneElement: function() {},
        createFactory: function() {},
        createMixin: function() {},
        isValidElement: function() {}
    },
    ReactDOM: {
        findDOMNode: function() {},
        render: function() {},
        unmountComponentAtNode: function() {}
    }
};

try {
    obj.React = window.React;
    obj.ReactDOM = window.ReactDOM;
} catch (err) {};

module.exports = obj;