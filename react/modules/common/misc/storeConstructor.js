var Misc = require('./functions.js');
var EventEmitter = require('events').EventEmitter;

module.exports = function(initialState) {
    var emitter = new EventEmitter();
    emitter.setMaxListeners(20);
    var state = initialState || {};
    var getInitState = function() {
        return Misc.immutableClone(initialState);
    };
    var getState = function() {
        return Misc.immutableClone(state);
    };
    var updateState = function(newState) { // nếu assign newstate -> state sẽ lỗi những module cũ
        if (newState && newState.constructor === Function) {
            newState = newState(getState());
        }
        if (newState) {
            state = Misc.immutableClone(newState);
        }
    };
    var emitStateChange = function() {
        var state = getState()
        emitter.emit('stateChange', state);

        if (Misc.isDebugging()) {
            var originAction = Misc.getStackTrace()[4] || '';
            console.log('%c' + originAction, 'color:blue', state);
        }
    };
    var onStateChange = function(callback) {
        emitter.on('stateChange', callback);
    };
    var removeStateChangeListener = function(callbackFunction) {
        emitter.removeListener('stateChange', callbackFunction);
    };
    var updateAndEmit = function(newState) {
        updateState(newState);
        emitStateChange();
    };
    var reset = function() {
        state = getInitState();
        emitter.removeAllListeners();
    };
    var register = function(map) {
        if (!map || map.constructor !== Function) throw new Error('must be function');
        var _callback;
        var prevState = {};

        var get = function() {
            return map(getState());
        };

        var onChange = function(callback) {
            if (!callback || callback.constructor !== Function) throw new Error('must be function');

            _callback = function(appState) {
                var nextState = map(appState);
                if (JSON.stringify(prevState) !== JSON.stringify(nextState)) {
                    prevState = nextState;
                    callback(nextState);
                }
            };
            onStateChange(_callback);

            return stateListener; // return stateListener to chain calls
        };

        var remove = function() {
            removeStateChangeListener(_callback);

            return stateListener; // return stateListener to chain calls
        };

        var stateListener = {
            get: get,
            onChange: onChange,
            remove: remove
        };

        return stateListener;
    };
    var connect = function(element, map) {
        if (element.constructor === Object) {
            element = React.createClass(element);
        }
        var noMapFunction = map ? false : true;
        map = map || function() { return {}; };
        // returns a wrapper element with auto updating props for child element (registered within map() function)
        // (only update props / re-render when props changes)
        return React.createClass({
            displayName: 'connect:' + (element.displayName || Misc.getUniqueString()),
            getInitialState: function() {
                var that = this;
                var appState = getState();
                // var state = Misc.objAssign({}, map(appState), that.props);
                var state = {
                    mappedState: map(appState),
                    ownProps: that.props
                };

                return state;
            },
            componentWillReceiveProps: function(nextProps) {
                this.setState({ ownProps: nextProps });
            },
            componentWillMount: function() {
                if (noMapFunction) return;
                onStateChange(this.onStoreUpdate);
            },
            componentWillUnmount: function() {
                if (noMapFunction) return;
                removeStateChangeListener(this.onStoreUpdate);
            },
            onStoreUpdate: function(appState) {
                var nextMappedState = map(appState);
                if (!Misc.jsonEqual(this.state.mappedState, nextMappedState)) this.setState({ mappedState: nextMappedState });
            },
            render: function() {
                var that = this;
                return React.createElement(element, Object.assign(Misc.immutableClone(this.state.mappedState), this.state.ownProps));
            }
        });
    };
    var store = {
        getState: getState,
        getInitState: getInitState,
        updateState: updateState,
        update: updateState,
        emitStateChange: emitStateChange,
        onStateChange: onStateChange,
        updateAndEmit: updateAndEmit,
        setState: updateAndEmit,
        connect: connect,
        register: register,
        reset: reset,
        _emitter: emitter
    };
    
    window._Store = store; // debug
    return store;
};