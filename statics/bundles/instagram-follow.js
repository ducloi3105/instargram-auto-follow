webpackJsonp([0],{

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
    query_hash: '37479f2b8209594dde7facb0d904896a',
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
    },
    filter: {
        limit: 1000,
        pageSize: 48,
        random_wait: 25,
        wait_between_actions: 25,
        wait_minus_after_sort_: 10,
        wait_hours_after_hard: 1
    },
    dataFollow: {
        listUser: [],
        total: 0
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
        var _this = this;

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
            _this.getListFollow();
        }).catch(function (ex) {
            console.warn("Get someone id  failed", ex);
        });
    },
    getListFollow: function getListFollow(after) {
        var _this2 = this;

        var state = _store2.default.getState();
        var payload = {
            query_hash: state.query_hash,
            userId: state.infoWho.id,
            first: state.filter.pageSize
        };
        if (after) payload.after = after;
        _API2.default.getListFollow(payload).then(function (data) {
            if (data.status == 200) {
                _store2.default.setState(function (state) {
                    state.dataFollow.listUser = state.dataFollow.listUser.concat(data.data.data.user.edge_followed_by.edges);
                    state.dataFollow.total = data.data.data.user.edge_followed_by.count;
                    return state;
                });

                setTimeout(function () {
                    var state = _store2.default.getState();
                    if (data.data.data.user.edge_followed_by.page_info.has_next_page && state.dataFollow.listUser.length <= state.filter.limit) {
                        _this2.getListFollow(data.data.data.user.edge_followed_by.page_info.end_cursor);
                    }
                }, 1000);
            }
        });
        //     .catch(ex =>{
        //     console.warn('Get list user follow failed ',ex)
        // })
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
                var iDiv = document.createElement('div');

                iDiv.id = 'show-follow-instagram-popup';
                document.getElementsByTagName('body')[0].appendChild(iDiv);
            }

            _reactDom2.default.render(_react2.default.createElement(_popupcontainer2.default, { display: 'unset' }), document.getElementById('show-follow-instagram-popup'));
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement('div', { className: 'follow-container', onClick: this.showPopup, title: 'Automation for Instagram\u2122' });
        }
    }]);

    return App;
}(_react2.default.Component), function (appState) {
    return {
        loginTo: appState.loginTo,
        publicKey: appState.publicKey
    };
});

if (!document.getElementById('follow-instagram-310594')) {
    var iDiv = document.createElement('div');
    iDiv.id = 'follow-instagram-310594';
    document.getElementsByTagName('body')[0].appendChild(iDiv);
}
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
    url: function url(query_hash, userId, first, after) {
        if (after) {
            return 'https://www.instagram.com/graphql/query/?query_hash=' + query_hash + '&variables={"id":"' + userId + '","first":' + first + ',"after":"' + after + '"}';
        }
        return 'https://www.instagram.com/graphql/query/?query_hash=' + query_hash + '&variables={"id":"' + userId + '","first":' + first + '}';
    },
    getListFollow: function getListFollow(payload) {
        return _axios2.default.get(this.url(payload.query_hash, payload.userId, payload.first, payload.after));
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
exports.push([module.i, "#follow-instagram-310594, article, div, footer, header, main, nav, section {\r\n    -ms-flex-align: stretch;\r\n    align-items: stretch;\r\n    border: 0 solid #000;\r\n    box-sizing: border-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -ms-flex-direction: column;\r\n    flex-direction: column;\r\n    -ms-flex-negative: 0;\r\n    flex-shrink: 0;\r\n    margin: 0;\r\n    padding: 0;\r\n    position: relative;\r\n}\r\n\r\na, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video {\r\n    margin: 0;\r\n    padding: 0;\r\n    border: 0;\r\n    font: inherit;\r\n    vertical-align: baseline;\r\n}\r\n\r\nbody, button, input, textarea {\r\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;\r\n    font-size: 14px;\r\n    line-height: 18px;\r\n}\r\n\r\n#show-follow-instagram-popup .popup-container {\r\n    background-color: rgba(0, 0, 0, .5);\r\n    bottom: 0;\r\n    -ms-flex-pack: justify;\r\n    justify-content: space-between;\r\n    left: 0;\r\n    overflow-y: auto;\r\n    -webkit-overflow-scrolling: touch;\r\n    position: fixed;\r\n    right: 0;\r\n    top: 0;\r\n    z-index: 99999;\r\n}\r\n\r\n#show-follow-instagram-popup .popup-container .close-popup {\r\n    background: 0 0;\r\n    border: 0;\r\n    cursor: pointer;\r\n    height: 36px;\r\n    outline: 0;\r\n    overflow: hidden;\r\n    position: absolute;\r\n    right: -10px;\r\n    top: -15px;\r\n    z-index: 100000;\r\n}\r\n\r\n#show-follow-instagram-popup .popup-container .close-popup::before {\r\n    color: black;\r\n    content: '\\D7';\r\n    display: block;\r\n    font-size: 36px;\r\n    font-weight: 600;\r\n    line-height: 36px;\r\n    padding: 0;\r\n    margin: 0;\r\n}\r\n\r\n#follow-instagram-310594 .follow-container {\r\n    /*width: 40px;*/\r\n    /*height: 40px;*/\r\n    position: fixed;\r\n    top: 150px;\r\n    left: 10px;\r\n    /*background-image: url(../../../../statics/images/instagram_white.png);*/\r\n    background-image: url(/static/bundles/base/sprite_core.png/b32d382b99a8.png);\r\n    background-repeat: no-repeat;\r\n    background-position: -395px -430px;\r\n    height: 30px;\r\n    width: 30px;\r\n    cursor:pointer;\r\n}\r\n\r\n._5rnaq .follow-container {\r\n    width: 36px;\r\n    height: 36px;\r\n    cursor: pointer;\r\n    display: inline-block;\r\n    background-size: contain;\r\n    margin: -12px 10px 0px 0px;\r\n    background-image: url(/static/bundles/base/sprite_core.png/b32d382b99a8.png);\r\n    top: 0;\r\n}\r\n\r\n#show-follow-instagram-popup #BotInjectedContainer {\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    vertical-align: baseline;\r\n    background-color: rgb(254, 254, 254);\r\n    position: fixed;\r\n    width: 98%;\r\n    top: 3%;\r\n    left: 1%;\r\n    z-index: 9999;\r\n    height: 94%;\r\n    -ms-flex-direction: row;\r\n        flex-direction: row;\r\n    -ms-flex-wrap: wrap;\r\n        flex-wrap: wrap;\r\n    -ms-flex-align: start;\r\n        align-items: flex-start;\r\n    -ms-flex-line-pack: start;\r\n        align-content: flex-start;\r\n    resize: both;\r\n    margin: 0px;\r\n    font: inherit;\r\n    border-width: 1px;\r\n    border-style: solid;\r\n    border-color: rgb(204, 204, 204);\r\n    -o-border-image: initial;\r\n       border-image: initial;\r\n    padding: 1%;\r\n}\r\n\r\n#BotInjectedContainer .container-wrapper {\r\n    height: 100%;\r\n    width: 100%;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -ms-flex-positive: 1;\r\n        flex-grow: 1;\r\n    /*overflow-x: auto;*/\r\n    /*overflow-y: hidden;*/\r\n\r\n}\r\n\r\n#BotInjectedContainer .container-wrapper .header-wrap {\r\n    height: 50px;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -ms-flex-positive: 1;\r\n        flex-grow: 1;\r\n}\r\n\r\n#BotInjectedContainer .container-wrapper .header-wrap h1 {\r\n    font-size: 28px;\r\n    line-height: 28px;\r\n    font-weight: bold;\r\n    margin: 0 0 10px;\r\n}\r\n\r\n#BotInjectedContainer .content-wrap {\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -ms-flex-positive: 1;\r\n        flex-grow: 1;\r\n    height: calc(100% - 77px);\r\n    -ms-flex-direction: row;\r\n        flex-direction: row;\r\n}\r\n\r\n#BotInjectedContainer .content-wrap .left-panel-wrapper {\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -ms-flex-direction: row;\r\n        flex-direction: row;\r\n    -ms-flex-wrap: wrap;\r\n        flex-wrap: wrap;\r\n    width: 100%;\r\n    max-width: calc(100% - 320px);\r\n    overflow-y: auto;\r\n    overflow-x: hidden;\r\n}\r\n\r\n#BotInjectedContainer .content-wrap .list-item {\r\n    width: 245px;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -ms-flex-direction: row;\r\n        flex-direction: row;\r\n    -ms-flex-wrap: nowrap;\r\n        flex-wrap: nowrap;\r\n    -ms-flex-align: center;\r\n        align-items: center;\r\n    margin: 0;\r\n    height: 66px;\r\n}\r\n\r\n#BotInjectedContainer .content-wrap .list-item img.avatar {\r\n    width: 50px;\r\n    height: 50px;\r\n    border-width: 4px;\r\n    border-style: solid;\r\n    border-color: white;\r\n    -o-border-image: initial;\r\n       border-image: initial;\r\n    border-radius: 10px;\r\n    margin: 0 3px 0 0;\r\n}\r\n\r\n#BotInjectedContainer .content-wrap .list-item .info-user {\r\n    width: 100%;\r\n}\r\n\r\n#BotInjectedContainer .content-wrap .list-item .info-user a {\r\n    color: #003569;\r\n    text-decoration: none;\r\n}\r\n\r\n#BotInjectedContainer .content-wrap .list-item .info-user a, #BotInjectedContainer .content-wrap .list-item .info-user span {\r\n    width: 100%;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n}\r\n\r\n@media only screen and (max-width: 820px) {\r\n    #BotInjectedContainer .content-wrap {\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n        overflow: auto;\r\n    }\r\n\r\n    #BotInjectedContainer .content-wrap .right-panel-wrapper, #BotInjectedContainer .content-wrap .left-panel-wrapper {\r\n        width: 100%;\r\n        max-width: 100%;\r\n    }\r\n\r\n}\r\n\r\n#BotInjectedContainer .content-wrap .right-panel-wrapper {\r\n    width: 300px;\r\n    min-width: 300px;\r\n    background: blue;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -ms-flex-direction: column;\r\n        flex-direction: column;\r\n    -ms-flex-pack: justify;\r\n        justify-content: space-between;\r\n    -ms-flex-align: start;\r\n        align-items: flex-start;\r\n    min-height: 100%;\r\n}\r\n\r\n.multi-actions-button{\r\n    text-align: center;\r\n    color: white;\r\n    background-color: green;\r\n    font-weight: bold;\r\n    cursor: pointer;\r\n    width: 100%;\r\n    margin: 5px 0px;\r\n    border-radius: 3px;\r\n    padding: 8px 0px;\r\n}", ""]);

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

var _leftPanelItem = __webpack_require__(76);

var _leftPanelItem2 = _interopRequireDefault(_leftPanelItem);

var _rightPanelWrapper = __webpack_require__(77);

var _rightPanelWrapper2 = _interopRequireDefault(_rightPanelWrapper);

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
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.display !== this.state.display) this.setState({ display: nextProps.display });
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
                    'div',
                    { id: 'BotInjectedContainer' },
                    _react2.default.createElement(
                        'div',
                        { className: 'container-wrapper' },
                        _react2.default.createElement(
                            'div',
                            { className: 'header-wrap' },
                            _react2.default.createElement(
                                'h1',
                                null,
                                'Automation for Instagram\u2122'
                            ),
                            _react2.default.createElement('button', { className: 'close-popup', onClick: this.closePopup })
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'content-wrap' },
                            _react2.default.createElement(_leftPanelItem2.default, null),
                            _react2.default.createElement(_rightPanelWrapper2.default, null)
                        )
                    )
                )
            );
        }
    }]);

    return PopupContainer;
}(_react2.default.Component);

exports.default = PopupContainer;

/***/ }),

/***/ 76:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _store = __webpack_require__(16);

var _store2 = _interopRequireDefault(_store);

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
            if (!this.props.listUser.length) return _react2.default.createElement(
                "div",
                { className: "left-panel-wrapper" },
                _react2.default.createElement(
                    "pre",
                    null,
                    "No data!"
                )
            );
            return _react2.default.createElement(
                "div",
                { className: "left-panel-wrapper" },
                this.props.listUser.map(function (item, index) {
                    var node = item.node;
                    return _react2.default.createElement(
                        "div",
                        { className: "list-item", key: node.id },
                        _react2.default.createElement("img", { src: node.profile_pic_url + '?' + node.id, className: "avatar" }),
                        _react2.default.createElement(
                            "div",
                            { className: "info-user" },
                            _react2.default.createElement(
                                "a",
                                { href: "https://instagram.com/" + node.username },
                                node.username
                            ),
                            _react2.default.createElement(
                                "span",
                                null,
                                node.full_name
                            )
                        )
                    );
                })
            );
        }
    }]);

    return App;
}(_react2.default.Component), function (appState) {
    return {
        listUser: appState.dataFollow.listUser
    };
});
exports.default = ListFollow;

/***/ }),

/***/ 77:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RightPanel = function (_React$Component) {
    _inherits(RightPanel, _React$Component);

    function RightPanel() {
        _classCallCheck(this, RightPanel);

        return _possibleConstructorReturn(this, (RightPanel.__proto__ || Object.getPrototypeOf(RightPanel)).apply(this, arguments));
    }

    _createClass(RightPanel, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement("div", { className: "right-panel-wrapper" });
        }
    }]);

    return RightPanel;
}(_react2.default.Component);

exports.default = RightPanel;

/***/ })

},[68]);