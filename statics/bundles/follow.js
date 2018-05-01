webpackJsonp([2],{

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createStore = __webpack_require__(9);

var _createStore2 = _interopRequireDefault(_createStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var state = {
    loginTo: 'instagram',
    publicKey: '1q65G1o9uDePDgZXhIt7xEgaL-A', // demo,
    instagramData: null,
    appProps: {}
};

exports.default = (0, _createStore2.default)(state);

/***/ }),

/***/ 15:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _store = __webpack_require__(10);

var _store2 = _interopRequireDefault(_store);

var _oauthioWeb = __webpack_require__(14);

var _API = __webpack_require__(47);

var _API2 = _interopRequireDefault(_API);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _instagramFunc = void 0;
var Actions = {
    instagramFunc: function instagramFunc() {
        return _instagramFunc;
    },
    setAppProps: function setAppProps(appProps) {
        _store2.default.setState(function (state) {
            Object.assign(state.appProps, appProps);
            return state;
        });
    },
    setCaptchaImg: function setCaptchaImg(captchaUrl) {
        _store2.default.setState(function (state) {
            state.captchaImg = captchaUrl + '?t=' + new Date().getTime();
            return state;
        });
    },
    onLogin: function onLogin() {
        var state = _store2.default.getState();
        var publicKey = state.publicKey; //demo
        var loginTo = state.loginTo;
        _oauthioWeb.OAuth.initialize(publicKey);
        _oauthioWeb.OAuth.popup(loginTo).then(function (instagram) {
            console.log('instagram:', instagram);
            _instagramFunc = instagram;
            instagram.me().then(function (data) {
                console.log('me data:', data);
                data.access_token = instagram.access_token;

                _store2.default.setState(function (state) {
                    state.instagramData = data;
                    return state;
                });

                _API2.default.getListFollow({
                    token: data.access_token,
                    userId: data.id
                }).then(function (data) {
                    console.log(data);
                }).catch(function (ex) {
                    console.log(ex);
                    if (ex.response) {
                        console.log(ex.response);
                    }
                });
                // alert('Instagram says your name is ' + data.name + ".\nView browser 'Console Log' for more details");
            });
            //
            // instagram.get('/v1/users/self/').then(data => {
            //     console.log('self data:', data);
            //
            //
            // })
        }).fail(function (ex) {
            console.warn(ex);
        });
    },
    getUserIdFromUrl: function getUserIdFromUrl() {
        var href = '';
        var url = window.location.origin;
        var userName = window.location.pathname.split('/');
        if (userName.length > 1) {
            userName = userName[1];
            href = url + '/' + userName;
            _API2.default.getUserIdFromUrl(href).then(function (data) {
                data = JSON.parse(data.split("window._sharedData = ")[1].split(";</script>")[0]).entry_data.ProfilePage[0].graphql;
                console.log(data);
            }).catch(function (ex) {
                console.warn('Get userid faile: ', ex);
            });
        }
    }
};

exports.default = Actions;

/***/ }),

/***/ 46:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(5);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _oauthioWeb = __webpack_require__(14);

var _store = __webpack_require__(10);

var _store2 = _interopRequireDefault(_store);

var _actions = __webpack_require__(15);

var _actions2 = _interopRequireDefault(_actions);

var _listFollow = __webpack_require__(66);

var _listFollow2 = _interopRequireDefault(_listFollow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = _store2.default.connect(function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

        _this.openPopup = _this.openPopup.bind(_this);
        _this.onLogin = _this.onLogin.bind(_this);
        return _this;
    }

    _createClass(App, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            console.log('didmount');
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            console.log('willmount');
        }
    }, {
        key: 'onLogin',
        value: function onLogin() {
            console.log('ádd', this.props);
            var publicKey = this.props.publicKey; //demo
            var loginTo = this.props.loginTo;
            _oauthioWeb.OAuth.initialize(publicKey);

            _oauthioWeb.OAuth.popup(loginTo).then(function (instagram) {
                console.log('instagram:', instagram);
                instagram.me().then(function (data) {
                    console.log('me data:', data);
                    alert('Instagram says your name is ' + data.name + ".\nView browser 'Console Log' for more details");
                });

                instagram.get('/v1/users/self').then(function (data) {
                    console.log('self data:', data);
                });
            }).fail(function (ex) {
                console.warn(ex);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            // return (
            //     <ListFollow/>
            // )
            return _react2.default.createElement(
                'div',
                { className: 'follow-container' },
                _react2.default.createElement('h1', { className: 'follow-icon follow-icon-instagram' }),
                _react2.default.createElement(
                    'a',
                    { id: 'instagram-button', className: 'btn btn-block btn-social btn-instagram', onClick: _actions2.default.onLogin },
                    _react2.default.createElement('i', { className: 'fa fa-instagram' }),
                    ' Sign in with Instagram'
                )
            );
        }
    }, {
        key: 'openPopup',
        value: function openPopup() {
            var url = 'https://api.instagram.com/oauth/authorize/?client_id=' + this.state.clientId + '&redirect_uri=' + this.state.redirectUri + '&response_type=code',
                title = 'Login Instagram',
                wLeft = window.screenLeft ? window.screenLeft : window.screenX,
                wTop = window.screenTop ? window.screenTop : window.screenY,
                w = 500,
                h = 500,
                left = wLeft + window.innerWidth / 2 - w / 2,
                top = wTop + window.innerHeight / 2 - h / 2;
            return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
        }
    }]);

    return App;
}(_react2.default.Component), function (appState) {
    return {
        loginTo: appState.loginTo,
        publicKey: appState.publicKey
    };
});

_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('follow-instagram-310594'));

/***/ }),

/***/ 47:
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

/***/ 66:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _store = __webpack_require__(10);

var _store2 = _interopRequireDefault(_store);

var _actions = __webpack_require__(15);

var _actions2 = _interopRequireDefault(_actions);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _itemFollow = __webpack_require__(67);

var _itemFollow2 = _interopRequireDefault(_itemFollow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListFollow = _store2.default.connect(function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
    }

    _createClass(App, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                _react.Fragment,
                null,
                _react2.default.createElement("div", { className: "header-container" }),
                _react2.default.createElement(
                    "div",
                    { className: "suggest-for-you" },
                    _react2.default.createElement(
                        "h2",
                        null,
                        "Suggest for you"
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: "list-container" },
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8].map(function () {
                        return _react2.default.createElement(_itemFollow2.default, null);
                    })
                )
            );
        }
    }]);

    return App;
}(_react2.default.Component), function (appState) {
    return {};
});

exports.default = ListFollow;

/***/ }),

/***/ 67:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _store = __webpack_require__(10);

var _store2 = _interopRequireDefault(_store);

var _actions = __webpack_require__(15);

var _actions2 = _interopRequireDefault(_actions);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ItemFollow = _store2.default.connect(function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
    }

    _createClass(App, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "li",
                { className: "list-item" },
                _react2.default.createElement(
                    "div",
                    { className: "item-container" },
                    _react2.default.createElement(
                        "div",
                        { className: "item-wrapper" },
                        _react2.default.createElement(
                            "div",
                            { className: "item-content" },
                            _react2.default.createElement(
                                "div",
                                { className: "follow-avatar" },
                                _react2.default.createElement("img", { src: "https://instagram.fhan5-7.fna.fbcdn.net/vp/2a2198150ea58759f4bec26c7ff72dd7/5B99881F/t51.2885-19/s150x150/30829937_2025200807509083_1611304827030077440_n.jpg", alt: "" })
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "follow-info" },
                                _react2.default.createElement(
                                    "div",
                                    { className: "follow-account" },
                                    "nguyen duc loi"
                                ),
                                _react2.default.createElement(
                                    "div",
                                    { className: "follow-fullname" },
                                    "asdasdasd"
                                )
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "follow-button" },
                                _react2.default.createElement(
                                    "span",
                                    null,
                                    _react2.default.createElement(
                                        "button",
                                        null,
                                        "Follow"
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return App;
}(_react2.default.Component), function (appState) {
    return {};
});

exports.default = ItemFollow;

/***/ })

},[46]);