import EventEmitter from 'events';
import React from 'react';
import { jsonClone, makeId, uniqueId, isDebugging, getStackTrace } from './utils';

export default initialState => {
    var emitter = new EventEmitter();
    emitter.setMaxListeners(Infinity);
    
    var state = jsonClone(initialState || {});
    var getInitState = function() { // get state ban đầu (dùng để reset state component về ban đầu)
        return jsonClone(initialState);
    };
    var getState = function() {
        return jsonClone(state);
    };
    var replaceState = newState => { // có thể truyền object hoặc function(prevState) { return nextState; }
        if (typeof newState == 'function') {
            newState = newState(getState());
        }
        if (newState) {
            state = jsonClone(newState);
            emitStateChange();
        }
    };
    var setState = newState => { // có thể truyền object hoặc function(prevState) { return nextState; }
        if (typeof newState == 'function') {
            newState = newState(getState());
        }
        if (newState) {
            Object.assign(state, jsonClone(newState));
            emitStateChange();
        }
    };
    var emitStateChange = function() {
        var state = getState();
        emitter.emit('STATE_CHANGED', state);

        if (isDebugging()) { // debugging output
            var originAction = getStackTrace()[4] || '';
            console.log('%c' + originAction, 'color:blue', state);
        }
    };
    var onStateChange = function(callback) {
        emitter.on('STATE_CHANGED', callback);
    };
    var removeStateListener = function(callbackFunction) {
        emitter.removeListener('STATE_CHANGED', callbackFunction);
    };
    var reset = function() { // gọi khi component App willUnmount
        state = getInitState();
        emitter.removeAllListeners();
    };
    var connect = function(Component, map) {
        if (!Component || Component.constructor !== Function) throw new Error('expected React element');
        var hasMapFunction = !!map;
        map = map || function() { return {}; };
        // returns a wrapper component with auto updating props for child component (registered within map() function)
        // (only update props / re-render when props changes)

        class ConnectHOC extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    mappedState: map(getState()),
                    ownProps: this.props
                };

                if (hasMapFunction) {
                    this.onStoreUpdate = this.onStoreUpdate.bind(this);
                    onStateChange(this.onStoreUpdate);
                }
            }
            onStoreUpdate(appState) {
                if (this._UNMOUNTED) return;
                var nextMappedState = map(appState);
                if (JSON.stringify(this.state.mappedState) !== JSON.stringify(nextMappedState)) {
                    this.setState({ mappedState: nextMappedState });
                }
            }
            componentWillReceiveProps(nextProps) {
                this.setState({ ownProps: nextProps });
            }
            componentWillUnmount() {
                this._UNMOUNTED = true; // fix bug emitter: sau khi removeListener giữa lúc emit vẫn bị callback (xem function test())
                if (hasMapFunction) removeStateListener(this.onStoreUpdate);
            }
            render() {
                var that = this;
                var props = Object.assign(jsonClone(this.state.mappedState), this.state.ownProps);
                return <Component ref={this.props._forwardedRef} {...props}></Component>;
            }
        }

        ConnectHOC.displayName = 'connect:' + (Component.displayName || Component.name || uniqueId());
        return !React.forwardRef ? ConnectHOC : React.forwardRef((props, ref) => (
            <ConnectHOC {...props} _forwardedRef={ref || undefined}></ConnectHOC>
        ));
    };
    let _constructor={
        _emitter: emitter,
        getInitState,
        getState,
        replaceState,
        setState,
        emitStateChange,
        onStateChange,
        removeStateListener,
        reset,
        connect
    };
    window._StoreObject = _constructor;
    return _constructor;
};

// var test = f => {
//     var EE = require('events');
//     var emitter = new EE();
//     var a = f => {
//         emitter.removeListener('test', b);
//         console.log('a');
//     }
//     var b = f => console.log('b');
//     emitter.on('test', a);
//     emitter.on('test', b);
//     emitter.emit('test'); // -> 'a', 'b'
// };