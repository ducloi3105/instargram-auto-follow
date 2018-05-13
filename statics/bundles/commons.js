/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [], result;
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/ 		if(executeModules) {
/******/ 			for(i=0; i < executeModules.length; i++) {
/******/ 				result = __webpack_require__(__webpack_require__.s = executeModules[i]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// objects to store loaded and loading chunks
/******/ 	var installedChunks = {
/******/ 		1: 0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "F:\\project\\node\\react";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/ })
/************************************************************************/
/******/ ({

/***/ 26:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    nameSpace: 'micro_function_',

    setSessionData: function setSessionData(key, content, expireMinutes) {
        try {
            if (typeof Storage !== "undefined") {
                if (expireMinutes == undefined || expireMinutes == null || typeof expireMinutes == "string") expireMinutes = 5;

                key = this.nameSpace + key;
                var expireDate = new Date();
                expireDate.setTime(expireDate.getTime() + expireMinutes * 60 * 1000);

                sessionStorage.setItem(key, JSON.stringify({ value: content, expire: expireDate.getTime() }));
                return true;
            }
        } catch (ex) {
            console.warn('set session data by key ' + key + ' error', ex);
            return false;
        }
    },
    getSessionData: function getSessionData(key) {
        try {
            if (typeof Storage !== "undefined") {
                key = this.nameSpace + key;
                var _value = sessionStorage.getItem(key);
                try {
                    if (_value != null && _value != "") {
                        var _jsonData = JSON.parse(_value);
                        if (typeof _jsonData.expire != 'undefined') {
                            var expireDate = _jsonData.expire;
                            if (expireDate < new Date().getTime()) {
                                sessionStorage.removeItem(key);

                                return "";
                            }
                        }

                        return typeof _jsonData.value != 'undefined' ? _jsonData.value : _value;
                    } else {
                        return _value;
                    }
                } catch (ex) {
                    console.warn('get session data by key ' + key + ' error', ex);
                    return _value;
                }
            }
        } catch (e) {
            return "";
        }
    },
    removeSessionData: function removeSessionData(key) {
        try {
            if (typeof Storage !== "undefined") {
                key = this.nameSpace + key;
                sessionStorage.removeItem(key);

                return true;
            }
        } catch (e) {}

        return false;
    },
    setLocalData: function setLocalData(key, content, expireMinutes) {
        try {
            if (typeof Storage !== "undefined") {
                if (expireMinutes == undefined || expireMinutes == null || typeof expireMinutes == "string") expireMinutes = 5;

                key = this.nameSpace + key;
                var expireDate = new Date();
                expireDate.setTime(expireDate.getTime() + expireMinutes * 60 * 1000);

                localStorage.setItem(key, JSON.stringify({ value: content, expire: expireDate.getTime() }));
                return true;
            }
        } catch (ex) {
            console.warn('set session data by key ' + key + ' error', ex);
            return false;
        }
    },
    getLocalData: function getLocalData(key) {
        try {
            if (typeof Storage !== "undefined") {
                key = this.nameSpace + key;
                var _value = localStorage.getItem(key);
                try {
                    if (_value != null && _value != "") {
                        var _jsonData = JSON.parse(_value);
                        if (typeof _jsonData.expire != 'undefined') {
                            var expireDate = _jsonData.expire;
                            if (expireDate < new Date().getTime()) {
                                localStorage.removeItem(key);

                                return "";
                            }
                        }

                        return typeof _jsonData.value != 'undefined' ? _jsonData.value : _value;
                    } else {
                        return _value;
                    }
                } catch (ex) {
                    console.warn('get session data by key ' + key + ' error', ex);
                    return _value;
                }
            }
        } catch (e) {
            return "";
        }
    },
    removeLocalData: function removeLocalData(key) {
        try {
            if (typeof Storage !== "undefined") {
                key = this.nameSpace + key;
                localStorage.removeItem(key);

                return true;
            }
        } catch (e) {}

        return false;
    },


    uniDecode: function uniDecode(s) {
        if (!s || s.length === 0) return s;
        var sb = [];
        var UniChars = "àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺẼẸÊỀẾỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴÂĂĐÔƠƯ";
        var UniDecodeChars = "aaaaaaaaaaaaaaaaaeeeeeeeeeeediiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAAEEEEEEEEEEEDIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYAADOOU";

        s.split('').forEach(function (t) {
            var pos = UniChars.indexOf(t);
            sb.push(pos >= 0 ? UniDecodeChars[pos] : t);
        });
        return sb.join('');
    },
    randomIntFromTo: function randomIntFromTo(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
};

/***/ }),

/***/ 42:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = __webpack_require__(43);

var _events2 = _interopRequireDefault(_events);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _utils = __webpack_require__(44);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (initialState) {
    var emitter = new _events2.default();
    emitter.setMaxListeners(Infinity);

    var state = (0, _utils.jsonClone)(initialState || {});
    var getInitState = function getInitState() {
        // get state ban đầu (dùng để reset state component về ban đầu)
        return (0, _utils.jsonClone)(initialState);
    };
    var getState = function getState() {
        return (0, _utils.jsonClone)(state);
    };
    var replaceState = function replaceState(newState) {
        // có thể truyền object hoặc function(prevState) { return nextState; }
        if (typeof newState == 'function') {
            newState = newState(getState());
        }
        if (newState) {
            state = (0, _utils.jsonClone)(newState);
            emitStateChange();
        }
    };
    var setState = function setState(newState) {
        // có thể truyền object hoặc function(prevState) { return nextState; }
        if (typeof newState == 'function') {
            newState = newState(getState());
        }
        if (newState) {
            Object.assign(state, (0, _utils.jsonClone)(newState));
            emitStateChange();
        }
    };
    var emitStateChange = function emitStateChange() {
        var state = getState();
        emitter.emit('STATE_CHANGED', state);

        if ((0, _utils.isDebugging)()) {
            // debugging output
            var originAction = (0, _utils.getStackTrace)()[4] || '';
            console.log('%c' + originAction, 'color:blue', state);
        }
    };
    var onStateChange = function onStateChange(callback) {
        emitter.on('STATE_CHANGED', callback);
    };
    var removeStateListener = function removeStateListener(callbackFunction) {
        emitter.removeListener('STATE_CHANGED', callbackFunction);
    };
    var reset = function reset() {
        // gọi khi component App willUnmount
        state = getInitState();
        emitter.removeAllListeners();
    };
    var connect = function connect(Component, map) {
        if (!Component || Component.constructor !== Function) throw new Error('expected React element');
        var hasMapFunction = !!map;
        map = map || function () {
            return {};
        };
        // returns a wrapper component with auto updating props for child component (registered within map() function)
        // (only update props / re-render when props changes)

        var ConnectHOC = function (_React$Component) {
            _inherits(ConnectHOC, _React$Component);

            function ConnectHOC(props) {
                _classCallCheck(this, ConnectHOC);

                var _this = _possibleConstructorReturn(this, (ConnectHOC.__proto__ || Object.getPrototypeOf(ConnectHOC)).call(this, props));

                _this.state = {
                    mappedState: map(getState()),
                    ownProps: _this.props
                };

                if (hasMapFunction) {
                    _this.onStoreUpdate = _this.onStoreUpdate.bind(_this);
                    onStateChange(_this.onStoreUpdate);
                }
                return _this;
            }

            _createClass(ConnectHOC, [{
                key: 'onStoreUpdate',
                value: function onStoreUpdate(appState) {
                    if (this._UNMOUNTED) return;
                    var nextMappedState = map(appState);
                    if (JSON.stringify(this.state.mappedState) !== JSON.stringify(nextMappedState)) {
                        this.setState({ mappedState: nextMappedState });
                    }
                }
            }, {
                key: 'componentWillReceiveProps',
                value: function componentWillReceiveProps(nextProps) {
                    this.setState({ ownProps: nextProps });
                }
            }, {
                key: 'componentWillUnmount',
                value: function componentWillUnmount() {
                    this._UNMOUNTED = true; // fix bug emitter: sau khi removeListener giữa lúc emit vẫn bị callback (xem function test())
                    if (hasMapFunction) removeStateListener(this.onStoreUpdate);
                }
            }, {
                key: 'render',
                value: function render() {
                    var that = this;
                    var props = Object.assign((0, _utils.jsonClone)(this.state.mappedState), this.state.ownProps);
                    return _react2.default.createElement(Component, _extends({ ref: this.props._forwardedRef }, props));
                }
            }]);

            return ConnectHOC;
        }(_react2.default.Component);

        ConnectHOC.displayName = 'connect:' + (Component.displayName || Component.name || (0, _utils.uniqueId)());
        return !_react2.default.forwardRef ? ConnectHOC : _react2.default.forwardRef(function (props, ref) {
            return _react2.default.createElement(ConnectHOC, _extends({}, props, { _forwardedRef: ref || undefined }));
        });
    };
    var _constructor = {
        _emitter: emitter,
        getInitState: getInitState,
        getState: getState,
        replaceState: replaceState,
        setState: setState,
        emitStateChange: emitStateChange,
        onStateChange: onStateChange,
        removeStateListener: removeStateListener,
        reset: reset,
        connect: connect
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

/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var jsonClone = exports.jsonClone = function jsonClone(obj) {
    return JSON.parse(JSON.stringify(obj));
};

var makeId = exports.makeId = function makeId(LENGTH) {
    // https://stackoverflow.com/a/1349426
    LENGTH = LENGTH || 5;
    var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var text = [];
    for (var i = 0; i < LENGTH; i++) {
        text[i] = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return text.join('');
};

var uniqueId = exports.uniqueId = function uniqueId(f) {
    return Date.now() + '_' + makeId(4);
};

var isDebugging = exports.isDebugging = function isDebugging() {
    var conditions = [// only need 1 condition to be true
    window._debug, ['192.168.60.70'].includes(window.location && window.location.hostname), window.locationStorage && locationStorage.getItem('_debug'), window.sessionStorage && sessionStorage.getItem('_debug')];
    return conditions.some(function (item) {
        return !!item;
    });
};

var getStackTrace = exports.getStackTrace = function getStackTrace() {
    // return array of stacktrace
    try {
        throw new Error('getStackTrace');
    } catch (e) {
        try {
            return e.stack.toString().trim().split('\n').map(function (item) {
                item = item.trim();
                if (item.startsWith('at ')) item = item.replace('at ', '');
                return item;
            });
        } catch (err) {
            console.warn(err);
            return [];
        }
    }
};

/***/ })

/******/ });