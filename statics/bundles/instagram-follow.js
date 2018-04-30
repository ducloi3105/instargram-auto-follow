webpackJsonp([1],{

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createStore = __webpack_require__(9);

var _createStore2 = _interopRequireDefault(_createStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var state = {
    infoAccount: {
        token: '',
        id: '',
        message: '',
        status: ''
    },
    infoWho: {
        id: '',
        username: '',
        message: '',
        status: ''
    }
};

exports.default = (0, _createStore2.default)(state);

/***/ }),

/***/ 29:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _store = __webpack_require__(16);

var _store2 = _interopRequireDefault(_store);

var _oauthioWeb = __webpack_require__(13);

var _API = __webpack_require__(69);

var _API2 = _interopRequireDefault(_API);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Actions = {
    getInfoAccount: function getInfoAccount() {
        var url = window.location.origin;
        _API2.default.getUserIdFromUrl(url).then(function (data) {
            _store2.default.setState(function (state) {
                try {
                    data = JSON.parse(data.data.split("window._sharedData = ")[1].split(";</script>")[0]);

                    state.infoAccount.token = data.config.csrf_token;
                    state.infoAccount.id = data.config.viewer.id;
                } catch (e) {
                    state.infoAccount.message = "Get info account (token, id)  failed";
                    console.warn("Get info account (token, id)  failed");
                }

                return state;
            });
        }).catch(function (ex) {
            console.warn("Get info account (token, id)  failed", ex);
        });
    },
    getSomeone: function getSomeone(username) {
        if (!username) return console.warn('Typing username or redirect link to user.');
        var url = window.location.origin;
        url += '/' + username;
        _API2.default.getUserIdFromUrl(url).then(function (data) {
            _store2.default.setState(function (state) {
                try {
                    data = JSON.parse(data.data.split("window._sharedData = ")[1].split(";</script>")[0]);
                    var ProfilePage = data.entry_data.ProfilePage;
                    if (ProfilePage.length > 0) {
                        var info = ProfilePage[0].graphql.user;
                        state.infoWho.username = info.username;
                        state.infoWho.id = info.id;
                    }
                    console.log(state);
                } catch (e) {
                    state.infoWho.message = "Get someone id  failed";
                    console.warn("Get someone id  failed");
                }

                return state;
            });
        }).catch(function (ex) {
            console.warn("Get someone id  failed", ex);
        });
    }
};

exports.default = Actions;

/***/ }),

/***/ 68:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(5);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _store = __webpack_require__(16);

var _store2 = _interopRequireDefault(_store);

var _actions = __webpack_require__(29);

var _actions2 = _interopRequireDefault(_actions);

__webpack_require__(70);

var _popupcontainer = __webpack_require__(75);

var _popupcontainer2 = _interopRequireDefault(_popupcontainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = _store2.default.connect(function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

        _this.showPopup = _this.showPopup.bind(_this);
        _this.handleGetSomeoneId = _this.handleGetSomeoneId.bind(_this);
        return _this;
    }

    _createClass(App, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            _actions2.default.getInfoAccount();
        }
    }, {
        key: 'handleGetSomeoneId',
        value: function handleGetSomeoneId(userUrl) {
            var pathname = window.location.pathname.split('/');
            if (pathname.length > 1) {
                pathname = pathname[1];
            }

            pathname = userUrl || pathname;
            _actions2.default.getSomeone(pathname);
        }
    }, {
        key: 'showPopup',
        value: function showPopup() {
            this.handleGetSomeoneId();
            if (!document.getElementById('show-follow-instagram-popup')) {
                var _iDiv = document.createElement('div');

                _iDiv.id = 'show-follow-instagram-popup';
                document.getElementsByTagName('body')[0].appendChild(_iDiv);
            }

            _reactDom2.default.render(_react2.default.createElement(_popupcontainer2.default, { display: 'unset' }), document.getElementById('show-follow-instagram-popup'));
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement('div', { className: 'follow-container', onClick: this.showPopup });
        }
    }]);

    return App;
}(_react2.default.Component), function (appState) {
    return {
        loginTo: appState.loginTo,
        publicKey: appState.publicKey
    };
});

var iDiv = document.createElement('div');

iDiv.id = 'follow-instagram-310594';
document.getElementsByTagName('body')[0].appendChild(iDiv);
_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('follow-instagram-310594'));

/***/ }),

/***/ 69:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axios = __webpack_require__(23);

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    url: function url(userId, token) {
        var first = 12;
        var id = "7094217709"; // user ID
        var query_hash = "37479f2b8209594dde7facb0d904896a";
        return "https://www.instagram.com/graphql/query/?query_hash=" + query_hash + "&variables={\"id\":\"" + id + "\",\"first\":" + first + "}";
    },
    getListFollow: function getListFollow(payload) {
        return _axios2.default.get(encodeURI(this.url(payload.userId, payload.token)));
    },
    getUserIdFromUrl: function getUserIdFromUrl(url) {
        return _axios2.default.get(url);
    }
};

/***/ }),

/***/ 70:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(71);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(73)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!./index.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/lib/index.js!./index.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 71:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(72)(false);
// imports


// module
exports.push([module.i, "#follow-instagram-310594, article, div, footer, header, main, nav, section {\r\n    -ms-flex-align: stretch;\r\n    align-items: stretch;\r\n    border: 0 solid #000;\r\n    box-sizing: border-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -ms-flex-direction: column;\r\n    flex-direction: column;\r\n    -ms-flex-negative: 0;\r\n    flex-shrink: 0;\r\n    margin: 0;\r\n    padding: 0;\r\n    position: relative;\r\n}\r\n\r\na, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video {\r\n    margin: 0;\r\n    padding: 0;\r\n    border: 0;\r\n    font: inherit;\r\n    vertical-align: baseline;\r\n}\r\n\r\nbody, button, input, textarea {\r\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;\r\n    font-size: 14px;\r\n    line-height: 18px;\r\n}\r\n\r\n#show-follow-instagram-popup .popup-container {\r\n    background-color: rgba(0, 0, 0, .5);\r\n    bottom: 0;\r\n    -ms-flex-pack: justify;\r\n    justify-content: space-between;\r\n    left: 0;\r\n    overflow-y: auto;\r\n    -webkit-overflow-scrolling: touch;\r\n    position: fixed;\r\n    right: 0;\r\n    top: 0;\r\n    z-index: 99999;\r\n}\r\n\r\n#show-follow-instagram-popup .popup-container .close-popup {\r\n    background: 0 0;\r\n    border: 0;\r\n    cursor: pointer;\r\n    height: 36px;\r\n    outline: 0;\r\n    overflow: hidden;\r\n    position: absolute;\r\n    right: 0;\r\n    top: 0;\r\n    z-index: 100000;\r\n}\r\n\r\n#show-follow-instagram-popup .popup-container .close-popup::before {\r\n    color: #fff;\r\n    content: '\\D7';\r\n    display: block;\r\n    font-size: 36px;\r\n    font-weight: 600;\r\n    line-height: 36px;\r\n    padding: 0;\r\n    margin: 0;\r\n}\r\n\r\n\r\n#follow-instagram-310594 .follow-container {\r\n    width: 40px;\r\n    height: 40px;\r\n    position: fixed;\r\n    top: 12px;\r\n    left: 0px;\r\n    /*background-image: url(../../../../statics/images/instagram_white.png);*/\r\n    background: red;\r\n}\r\n", ""]);

// exports


/***/ }),

/***/ 75:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(5);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _store = __webpack_require__(16);

var _store2 = _interopRequireDefault(_store);

var _actions = __webpack_require__(29);

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PopupContainer = function (_React$Component) {
    _inherits(PopupContainer, _React$Component);

    function PopupContainer() {
        _classCallCheck(this, PopupContainer);

        var _this = _possibleConstructorReturn(this, (PopupContainer.__proto__ || Object.getPrototypeOf(PopupContainer)).call(this));

        _this.state = {
            display: 'unset'
        };
        _this.closePopup = _this.closePopup.bind(_this);
        return _this;
    }

    _createClass(PopupContainer, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            console.log('didmount');
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.display != this.state.display) this.setState({ display: nextProps.display });
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            console.log('willmount');
        }
    }, {
        key: 'closePopup',
        value: function closePopup() {
            this.setState({ display: 'none' });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'popup-container', style: { display: this.state.display } },
                _react2.default.createElement(
                    'button',
                    { className: 'close-popup', onClick: this.closePopup },
                    '\u0110\xF3ng'
                )
            );
        }
    }]);

    return PopupContainer;
}(_react2.default.Component);

exports.default = PopupContainer;

/***/ })

},[68]);