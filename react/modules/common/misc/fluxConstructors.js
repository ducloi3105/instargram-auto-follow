var Misc = require('./functions.js');

var newStore = function(initialState, storeActions, dispatcher) {
    if (!dispatcher) return;
    dispatcher.setMaxListeners(15);
    var state = initialState || {};
    var getInitState = function() {
        return Misc.immutableClone(initialState);
    };
    var getState = function() {
        return Misc.immutableClone(state);
    };
    var updateState = function(newState, callback) {
        callback = callback || function() {};
        if (newState && newState.constructor === Function) {
            newState = newState(getState());
        }
        if (newState) {
            state = Misc.immutableClone(newState);
            callback();
        }
    };
    var emitStateChange = function() {
        var state = getState();
        dispatcher.emit('stateChange', state);
        Misc.consoleLog('state changed', state);
    };
    var updateAndEmit = function(newState) {
        updateState(newState, emitStateChange);
    };
    var connect = function(element, map) {
        if (element.constructor === Object) {
            element = React.createClass(element);
        }
        var noMapFunction = map ? false : true;
        map = map || function() { return null; };
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
                dispatcher.on('stateChange', this.onStoreUpdate);
            },
            componentWillUnmount: function() {
                if (noMapFunction) return;
                dispatcher.removeListener('stateChange', this.onStoreUpdate);
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

    var activated = false;
    var activate = function() {
        if (activated) return;
        activated = true;
        dispatcher.on('actionDispatched', function(payload) {
            if (storeActions[payload.action]) storeActions[payload.action](payload, store);
        });
    };
    var deactivate = function() {
        activated = false;
        state = getInitState();
        dispatcher.removeAllListeners();
    };

    var store = dispatcher;
    Misc.objAssign(store, {
        getState: getState,
        getInitState: getInitState,
        updateState: updateState,
        update: updateState,
        emitStateChange: emitStateChange,
        updateAndEmit: updateAndEmit,
        connect: connect,
        activate: activate,
        deactivate: deactivate
    });

    window._store1 = store; // debug
    return store;
};

var newActions = function(actions, dispatcher) {
    var actionConstructor = function(action) {
        return function(details, moreDetails) {
            var obj = { action: action };
            if (typeof details !== 'undefined') obj.details = details;
            if (typeof moreDetails !== 'undefined') obj.moreDetails = moreDetails;

            Misc.consoleLog('==============================\naction dispatched', obj);

            dispatcher.emit('actionDispatched', obj);
        };
    };

    var obj = {};
    if (actions.constructor === Array) {
        actions.forEach(function(action) {
            obj[action] = actionConstructor(action);
        });
    } else if (actions.constructor === Object) {
        for (var key in actions) {
            obj[key] = actionConstructor(key);
        }
    }
    window._dispatchAction = obj; // debug
    return obj;
};

var newDispatcher = function() {
    var EventEmitter = require('events').EventEmitter;
    return new EventEmitter();
};

module.exports = {
    newStore: newStore,
    newActions: newActions,
    newDispatcher: newDispatcher
};