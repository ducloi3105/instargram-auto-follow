webpackJsonp([0],{

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _store = __webpack_require__(7);

var _store2 = _interopRequireDefault(_store);

var _oauthioWeb = __webpack_require__(18);

var _API = __webpack_require__(76);

var _API2 = _interopRequireDefault(_API);

var _utils = __webpack_require__(34);

var _utils2 = _interopRequireDefault(_utils);

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
    pressUserId: function pressUserId(userId) {
        _store2.default.setState(function (state) {
            state.dataFollow.listUser = [];
            state.dataFollow.total = 0;
            state.loading_get_list_user = true;
            return state;
        });
        this.getSomeone(userId);
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
                } catch (e) {
                    state.infoWho.message = "Get info account failed";
                    alert("Get info account failed");
                }

                return state;
            });
            _this.getListFollow();
        }).catch(function (ex) {
            alert("UserId incorrect");
            _store2.default.setState(function (state) {
                state.infoWho.username = '';
                state.infoWho.id = '';
                state.loading_get_list_user = false;
                return state;
            });
        });
    },
    getListFollow: function getListFollow(after) {
        var _this2 = this;

        var state = _store2.default.getState();
        var pageSize = state.filter.pageSize > state.filter.limit ? state.filter.limit : state.filter.pageSize;
        var payload = {
            query_hash: state.query_hash,
            userId: state.infoWho.id,
            first: pageSize
        };
        if (after) payload.after = after;
        _API2.default.getListFollow(payload).then(function (data) {
            if (data.status === 200) {
                _store2.default.setState(function (state) {
                    state.dataFollow.listUser = state.dataFollow.listUser.concat(data.data.data.user.edge_followed_by.edges);
                    state.dataFollow.total = data.data.data.user.edge_followed_by.count;
                    return state;
                });

                setTimeout(function () {
                    var state = _store2.default.getState();
                    if (data.data.data.user.edge_followed_by.page_info.has_next_page && state.dataFollow.listUser.length <= state.filter.limit && state.filter.limit > state.filter.pageSize) {
                        _this2.getListFollow(data.data.data.user.edge_followed_by.page_info.end_cursor);
                    } else {
                        _store2.default.setState(function (state) {
                            state.loading_get_list_user = false;
                            return state;
                        });
                    }
                }, 1000);
            }
        }).catch(function (ex) {
            alert('Get list user follow failed ', ex);
            _store2.default.setState(function (state) {
                state.dataFollow.total = 0;
                state.loading_get_list_user = false;
                return state;
            });
        });
    },
    changeFilter: function changeFilter(which, value) {
        _store2.default.setState(function (state) {
            if (which === 'keywords') {
                state.filter[which] = value;
            } else if (which === 'showFollowers') {
                state.filter[which] = Object.assign({}, state.filter[which], value);
            } else if (which === 'limit') {
                value = parseInt(value);
                if (isNaN(value) || value <= 0) value = 0;
                state.filter[which] = value;
            } else if (which === 'showFollowed') {
                state.filter[which] = !state.filter[which];
            }
            return state;
        });
    },
    changeConfigure: function changeConfigure(which, value) {
        _store2.default.setState(function (state) {
            if (which === 'is_random') {
                state.configure[which] = !state.configure[which];
            } else {
                value = parseInt(value);
                if (isNaN(value) || value <= 0) value = 0;
                state.configure[which] = value;
            }
            return state;
        });
    },
    randomUserId: function randomUserId() {
        var state = _store2.default.getState();
        var _listUser = state.dataFollow.listUser.filter(function (item, index) {
            return item.node.followed_by_viewer === false && item.node.requested_by_viewer === false && item.node.is_verified === false;
        }).filter(function (item, index) {
            return state.filter.showFollowers.min <= index <= state.filter.showFollowers.max;
        }).filter(function (item) {
            return item.node.id !== state.infoAccount.id;
        });
        if (_listUser.length === 0) return null;
        if (_listUser.length === 1) return _listUser[0].node.id;
        var index = _utils2.default.randomIntFromTo(0, _listUser.length - 1);
        console.log('===', index, _listUser);

        if (index <= _listUser.length) return _listUser[index].node.id;else this.randomUserId();
    },
    followAll: function followAll() {
        var _this3 = this;

        var userId = this.randomUserId();
        if (!userId) return _store2.default.setState(function (state) {
            state.loading_follow_list_user = false;
            return state;
        });
        _store2.default.setState(function (state) {
            state.loading_follow_list_user = true;
            return state;
        });
        _API2.default.followAll(userId, _store2.default.getState().infoAccount.token).then(function (data) {
            if (data.data.status === 'ok') {
                _store2.default.setState(function (state) {
                    state.dataFollow.listUser.map(function (item, index) {
                        if (item.node.id === userId) {
                            item.node.followed_by_viewer = true;
                        }
                        return item;
                    });
                    state.configure.countFollow += 1;
                    return state;
                });

                var configure = _store2.default.getState().configure;
                var min = configure.wait_between_actions;
                if (configure.countFollow % 15 === 0) {
                    // follow 15 times => delay
                    min = configure.wait_minus_after_sort;
                }
                var max = min + min * (configure.random_wait / 100);
                var timeOut = _utils2.default.randomIntFromTo(min, max);
                setTimeout(function () {
                    _this3.followAll();
                }, timeOut * 1000);
            }
        }).catch(function (ex) {
            alert('Follow userid ' + userId + ' failed', ex);
            var configure = _store2.default.getState().configure;
            var min = configure.wait_between_actions;
            if (configure.countFollow % 15 === 0) {
                // follow 15 times => delay
                min = configure.wait_minus_after_sort;
            }
            var max = min + min * (configure.random_wait / 100);
            var timeOut = _utils2.default.randomIntFromTo(min, max);
            setTimeout(function () {
                _this3.followAll();
            }, timeOut * 1000);
        });
    },
    setShowFollowed: function setShowFollowed(is) {
        _store2.default.setState(function (state) {
            state.filter.showFollowed = is;
            return state;
        });
    }
};

exports.default = Actions;

/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createStore = __webpack_require__(11);

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
        showFollowers: {
            min: 0,
            max: 7500,
            minStep: 0,
            maxStep: 7500
        },
        keywords: '',
        showFollowed: true,
        hideFollowed: false
    },
    configure: {
        is_random: true,
        random_wait: 25,
        wait_between_actions: 25,
        wait_minus_after_sort: 10,
        countFollow: 0
    },
    dataFollow: {
        listUser: [],
        total: 0
    },
    loading_get_list_user: false,
    loading_follow_list_user: false

};

exports.default = (0, _createStore2.default)(state);

/***/ }),

/***/ 75:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(6);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _store = __webpack_require__(7);

var _store2 = _interopRequireDefault(_store);

var _actions = __webpack_require__(21);

var _actions2 = _interopRequireDefault(_actions);

__webpack_require__(77);

var _popupcontainer = __webpack_require__(80);

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
            // Action.getSomeone(pathname);
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

    //add css
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css';
    link.media = 'all';
    head.appendChild(link);
}
_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('follow-instagram-310594'));

/***/ }),

/***/ 76:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axios = __webpack_require__(28);

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    url: function url(query_hash, userId, first, after) {
        if (after) {
            return "https://www.instagram.com/graphql/query/?query_hash=" + query_hash + "&variables={\"id\":\"" + userId + "\",\"first\":" + first + ",\"after\":\"" + after + "\"}";
        }
        return "https://www.instagram.com/graphql/query/?query_hash=" + query_hash + "&variables={\"id\":\"" + userId + "\",\"first\":" + first + "}";
    },
    getListFollow: function getListFollow(payload) {
        return _axios2.default.get(this.url(payload.query_hash, payload.userId, payload.first, payload.after));
    },
    getUserIdFromUrl: function getUserIdFromUrl(url) {
        return _axios2.default.get(url);
    },
    followAll: function followAll(userId, token) {
        return _axios2.default.post("https://www.instagram.com/web/friendships/" + userId + "/follow/", null, {
            headers: {
                "x-csrftoken": token,
                "x-instagram-ajax": 1,
                "x-requested-with": "XMLHttpRequest"
            }
        });
    },
    getMoreDataUser: function getMoreDataUser(url) {
        return _axios2.default.get(url);
    }
};

/***/ }),

/***/ 77:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(78);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(36)(content, options);
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

/***/ 78:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(35)(false);
// imports


// module
exports.push([module.i, "#follow-instagram-310594, article, div, footer, header, main, nav, section {\n    -ms-flex-align: stretch;\n    align-items: stretch;\n    border: 0 solid #000;\n    box-sizing: border-box;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-direction: column;\n    flex-direction: column;\n    -ms-flex-negative: 0;\n    flex-shrink: 0;\n    margin: 0;\n    padding: 0;\n    position: relative;\n}\n\na, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video {\n    margin: 0;\n    padding: 0;\n    border: 0;\n    font: inherit;\n    vertical-align: baseline;\n}\n\nbody, button, input, textarea {\n    font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;\n    font-size: 14px;\n    line-height: 18px;\n}\n\n#show-follow-instagram-popup .popup-container {\n    background-color: rgba(0, 0, 0, .5);\n    bottom: 0;\n    -ms-flex-pack: justify;\n    justify-content: space-between;\n    left: 0;\n    overflow-y: auto;\n    -webkit-overflow-scrolling: touch;\n    position: fixed;\n    right: 0;\n    top: 0;\n    z-index: 99999;\n}\n\n\n#show-follow-instagram-popup .popup-container .progress {\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    height: 2px;\n    width: 0;\n    transition: width .2s, opacity .4s;\n    opacity: 1;\n    z-index: 999999;\n    background-color: rgb(0, 255, 20);\n}\n\n#show-follow-instagram-popup .popup-container .close-popup {\n    background: 0 0;\n    border: 0;\n    cursor: pointer;\n    height: 36px;\n    outline: 0;\n    overflow: hidden;\n    position: absolute;\n    right: -10px;\n    top: -15px;\n    z-index: 100000;\n}\n\n#show-follow-instagram-popup .popup-container .close-popup::before {\n    color: black;\n    content: '\\D7';\n    display: block;\n    font-size: 36px;\n    font-weight: 600;\n    line-height: 36px;\n    padding: 0;\n    margin: 0;\n}\n\n#follow-instagram-310594 .follow-container {\n    /*width: 40px;*/\n    /*height: 40px;*/\n    position: fixed;\n    top: 150px;\n    left: 10px;\n    /*background-image: url(../../../../statics/images/instagram_white.png);*/\n    background-image: url(/static/bundles/base/sprite_core.png/b32d382b99a8.png);\n    background-repeat: no-repeat;\n    background-position: -395px -430px;\n    height: 30px;\n    width: 30px;\n    cursor: pointer;\n}\n\n._5rnaq .follow-container {\n    width: 36px;\n    height: 36px;\n    cursor: pointer;\n    display: inline-block;\n    background-size: contain;\n    margin: -12px 10px 0px 0px;\n    background-image: url(/static/bundles/base/sprite_core.png/b32d382b99a8.png);\n    top: 0;\n}\n\n#show-follow-instagram-popup #BotInjectedContainer {\n    display: -ms-flexbox;\n    display: flex;\n    vertical-align: baseline;\n    background-color: rgb(254, 254, 254);\n    position: fixed;\n    width: 98%;\n    top: 3%;\n    left: 1%;\n    z-index: 9999;\n    height: 94%;\n    -ms-flex-direction: row;\n        flex-direction: row;\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n    -ms-flex-align: start;\n        align-items: flex-start;\n    -ms-flex-line-pack: start;\n        align-content: flex-start;\n    resize: both;\n    margin: 0px;\n    font: inherit;\n    border-width: 1px;\n    border-style: solid;\n    border-color: rgb(204, 204, 204);\n    -o-border-image: initial;\n       border-image: initial;\n    padding: 1%;\n}\n\n#BotInjectedContainer .container-wrapper {\n    height: 100%;\n    width: 100%;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-positive: 1;\n        flex-grow: 1;\n    /*overflow-x: auto;*/\n    /*overflow-y: hidden;*/\n\n}\n\n#BotInjectedContainer .container-wrapper .header-wrap {\n    height: 50px;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-positive: 1;\n        flex-grow: 1;\n}\n\n#BotInjectedContainer .container-wrapper .header-wrap h1 {\n    font-size: 28px;\n    line-height: 28px;\n    font-weight: bold;\n    margin: 0 0 10px;\n}\n\n#BotInjectedContainer .content-wrap {\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-positive: 1;\n        flex-grow: 1;\n    height: calc(100% - 77px);\n    -ms-flex-direction: row;\n        flex-direction: row;\n}\n\n#BotInjectedContainer .content-wrap .left-panel-wrapper {\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-direction: row;\n        flex-direction: row;\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n    width: 100%;\n    max-width: 100%;\n    overflow-y: auto;\n    overflow-x: hidden;\n    min-height: 70%;\n    max-height: 100%;\n}\n\n#show-follow-instagram-popup .popup-container .left-wrap{\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-direction: column;\n        flex-direction: column;\n    width: calc(100% - 400px);\n    max-width: calc(100% - 400px);\n    min-height: 70%;\n}\n\n#BotInjectedContainer .content-wrap .list-item {\n    width: 245px;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-direction: row;\n        flex-direction: row;\n    -ms-flex-wrap: nowrap;\n        flex-wrap: nowrap;\n    -ms-flex-align: center;\n        align-items: center;\n    margin: 0 10px 10px 0;\n    height: 66px;\n}\n\n#BotInjectedContainer .content-wrap .list-item.selected-item {\n    border: 2px solid red;\n    border-radius: 5%;\n}\n\n#BotInjectedContainer .content-wrap .list-item img.avatar {\n    width: 50px;\n    height: 50px;\n    border-width: 4px;\n    border-style: solid;\n    border-color: white;\n    -o-border-image: initial;\n       border-image: initial;\n    border-radius: 10px;\n    margin: 0 3px 0 0;\n}\n\n#BotInjectedContainer .content-wrap .list-item .info-user {\n    width: 100%;\n}\n\n#BotInjectedContainer .content-wrap .list-item .info-avatar {\n    cursor: pointer;\n}\n\n#BotInjectedContainer .content-wrap .list-item .info-user a {\n    color: #003569;\n    text-decoration: none;\n}\n\n#BotInjectedContainer .content-wrap .list-item .info-user a, #BotInjectedContainer .content-wrap .list-item .info-user span {\n    width: calc(100% - 60px);\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n}\n\n@media only screen and (max-width: 820px) {\n    #BotInjectedContainer .content-wrap {\n        -ms-flex-direction: column-reverse;\n            flex-direction: column-reverse;\n        overflow: auto;\n    }\n\n    #BotInjectedContainer .content-wrap .right-panel-wrapper, #BotInjectedContainer .content-wrap .left-panel-wrapper, #BotInjectedContainer .content-wrap .left-wrap {\n        width: 100% !important;\n        max-width: 100% !important;\n    }\n\n}\n\n.multi-actions-button {\n    text-align: center;\n    color: white;\n    background-color: #00807f;\n    font-weight: bold;\n    cursor: pointer;\n    width: 100%;\n    margin: 5px 0 15px 0;\n    border-radius: 3px;\n    padding: 8px 0;\n}\n\n#BotInjectedContainer .content-wrap .right-panel-wrapper {\n    width: 380px;\n    min-width: 380px;\n    display: -ms-flexbox;\n    display: flex;\n    padding: 15px;\n    overflow-y: auto;\n    overflow-x: hidden;\n}\n\n#BotInjectedContainer .content-wrap .right-panel-wrapper .config-options {\n    padding: 8px 0px 5px 10px;\n    border: 1px dashed rgb(204, 204, 204);\n    -o-border-image: initial;\n       border-image: initial;\n    margin: 0 0 10px;\n}\n\n#BotInjectedContainer .row-info {\n    margin-bottom: 15px;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-direction: unset;\n        flex-direction: unset;\n    -ms-flex-align: center;\n        align-items: center;\n    padding-right: 13px;\n}\n\n#BotInjectedContainer .row-info.input-range {\n    padding: 15px 20px 15px 6px;\n}\n\n#BotInjectedContainer .config-options .row-info input[type=\"number\"] {\n    width: 50px;\n    margin: 0 5px;\n}\n\n#BotInjectedContainer .config-options .row-info input[type=\"checkbox\"] {\n    width: 15px;\n    height: 15px;\n\n}\n\n#BotInjectedContainer input[type=\"text\"], #BotInjectedContainer input[type=\"number\"] {\n    width: 100%;\n    min-height: 30px;\n    border: 1px solid #b5b3b3;\n    border-radius: 4px;\n    padding: 5px 10px;\n    color: #333;\n    font: normal 13px Arial;\n    background-color: #fff;\n    display: block;\n    transition: border-color 0.2s ease-out;\n}\n\n.input-range__label {\n    color: #035a33 !important;\n}\n", ""]);

// exports


/***/ }),

/***/ 80:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(6);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _store = __webpack_require__(7);

var _store2 = _interopRequireDefault(_store);

var _actions = __webpack_require__(21);

var _actions2 = _interopRequireDefault(_actions);

var _leftPanelItem = __webpack_require__(81);

var _leftPanelItem2 = _interopRequireDefault(_leftPanelItem);

var _rightPanelWrapper = __webpack_require__(82);

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
                            _react2.default.createElement(
                                'div',
                                { className: 'left-wrap' },
                                _react2.default.createElement('div', { className: 'progress',
                                    style: {
                                        width: "0%",
                                        opacity: 0
                                    },
                                    'data-v-634ff062': '' }),
                                _react2.default.createElement(_leftPanelItem2.default, null)
                            ),
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

/***/ 81:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _store = __webpack_require__(7);

var _store2 = _interopRequireDefault(_store);

var _utils = __webpack_require__(34);

var _utils2 = _interopRequireDefault(_utils);

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
            var _this2 = this;

            if (!this.props.listUser.length) return _react2.default.createElement(
                "div",
                { className: "left-panel-wrapper" },
                _react2.default.createElement(
                    "pre",
                    null,
                    "No data!"
                )
            );

            var listUser = this.props.listUser.filter(function (item, index) {
                return (_utils2.default.uniDecode(item.node.username.toLowerCase()).indexOf(_utils2.default.uniDecode(_this2.props.filter.keywords.toLowerCase())) !== -1 || _utils2.default.uniDecode(item.node.full_name.toLowerCase()).indexOf(_utils2.default.uniDecode(_this2.props.filter.keywords.toLowerCase())) !== -1) && _this2.props.filter.showFollowers.min <= index && _this2.props.filter.showFollowers.max >= index;
            }).filter(function (item) {
                if (_this2.props.filter.showFollowed) {
                    return item;
                } else {
                    return item.node.followed_by_viewer === false && item.node.requested_by_viewer === false && item.node.is_verified === false;
                }
            }).filter(function (item) {
                if (_this2.props.filter.hideFollowed) {
                    return item.node.followed_by_viewer === false;
                }
                return item;
            }).filter(function (item) {
                return item.node.id !== _this2.props.infoAccount.id;
            });

            return _react2.default.createElement(
                "div",
                { className: "left-panel-wrapper" },
                listUser.map(function (item, index) {
                    var node = item.node;
                    var selected = item.selectedItem ? 'selected-item' : '';
                    return _react2.default.createElement(
                        "div",
                        { className: "list-item " + selected, key: index + '_' + node.id },
                        _react2.default.createElement(
                            "div",
                            { className: "info-avatar" },
                            _react2.default.createElement("img", { src: node.profile_pic_url + '?' + node.id, className: "avatar" })
                        ),
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
        infoAccount: appState.infoAccount,
        filter: appState.filter,
        listUser: appState.dataFollow.listUser
    };
});
exports.default = ListFollow;

/***/ }),

/***/ 82:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _store = __webpack_require__(7);

var _store2 = _interopRequireDefault(_store);

var _actions = __webpack_require__(21);

var _actions2 = _interopRequireDefault(_actions);

var _reactInputRange = __webpack_require__(83);

var _reactInputRange2 = _interopRequireDefault(_reactInputRange);

__webpack_require__(101);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RightPanel = _store2.default.connect(function (_React$Component) {
    _inherits(RightPanel, _React$Component);

    function RightPanel() {
        _classCallCheck(this, RightPanel);

        var _this = _possibleConstructorReturn(this, (RightPanel.__proto__ || Object.getPrototypeOf(RightPanel)).call(this));

        _this.state = {
            userId: '',
            message: ''
        };
        _this.changeUserId = _this.changeUserId.bind(_this);
        _this.handleLoadFollowers = _this.handleLoadFollowers.bind(_this);
        return _this;
    }

    _createClass(RightPanel, [{
        key: 'changeUserId',
        value: function changeUserId(e) {
            var value = e.target.value;
            var state = this.state;
            state.userId = value;
            if (value.startsWith('http://') || value.startsWith('https://')) state.message = 'Incorrect UserId';else if (value.indexOf('/') != -1) state.message = 'Incorrect UserId';else state.message = '';
            this.setState(state);
        }
    }, {
        key: 'handleLoadFollowers',
        value: function handleLoadFollowers() {
            if (this.props.loading_get_list_user) return;
            var userId = this.state.userId;
            if (!userId) {
                this.setState({ message: 'Please enter user id ' });
                return this.validUserId.focus();
            } else if (this.state.message) {
                return this.validUserId.focus();
            }
            _actions2.default.setShowFollowed(true);

            _actions2.default.pressUserId(userId);
        }
    }, {
        key: 'renderMessage',
        value: function renderMessage() {
            return _react2.default.createElement(
                'div',
                { className: 'row-info' },
                _react2.default.createElement(
                    'pre',
                    { style: { color: 'red' } },
                    this.state.message
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var props = this.props;
            console.log(props);
            return _react2.default.createElement(
                'div',
                { className: 'right-panel-wrapper' },
                _react2.default.createElement(
                    'details',
                    { className: 'config-wrapper', open: true },
                    _react2.default.createElement(
                        'summary',
                        null,
                        'Get follower from user id:'
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'config-options' },
                        _react2.default.createElement(
                            'div',
                            { className: 'row-info' },
                            'User Id:'
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'row-info' },
                            _react2.default.createElement('input', { type: 'text',
                                ref: function ref(e) {
                                    _this2.validUserId = e;
                                },
                                value: this.state.userId,
                                placeholder: 'Ex: MarkZuckerberg ...',
                                onChange: this.changeUserId,
                                onKeyUp: function onKeyUp(e) {
                                    if (e.keyCode === 13) {
                                        _this2.handleLoadFollowers();
                                    }
                                }
                            })
                        ),
                        this.renderMessage(),
                        _react2.default.createElement(
                            'div',
                            { className: 'row-info' },
                            'Limit get follower',
                            _react2.default.createElement('input', { type: 'number', value: props.limit,
                                onChange: function onChange(e) {
                                    _actions2.default.changeFilter('limit', e.target.value);
                                }
                            })
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'multi-actions-button', onClick: this.handleLoadFollowers },
                    _react2.default.createElement(
                        'span',
                        null,
                        props.loading_get_list_user ? _react2.default.createElement('i', { className: 'fa fa-spinner fa-pulse fa-fw' }) : null,
                        'Load ',
                        this.state.userId,
                        ' followers'
                    )
                ),
                _react2.default.createElement(
                    'details',
                    { className: 'config-wrapper' },
                    _react2.default.createElement(
                        'summary',
                        null,
                        'Filter list follower'
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'config-options' },
                        _react2.default.createElement(
                            'div',
                            { className: 'row-info' },
                            'Filter username or user id:'
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'row-info' },
                            _react2.default.createElement('input', { type: 'text', value: props.keywords, onChange: function onChange(e) {
                                    _actions2.default.changeFilter('keywords', e.target.value);
                                } })
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'row-info' },
                            'Show user followed:',
                            _react2.default.createElement('input', { type: 'checkbox', defaultChecked: props.showFollowed, onChange: function onChange(e) {
                                    _actions2.default.changeFilter('showFollowed', e.target.value);
                                } })
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'row-info' },
                            'Show follower from-to:'
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'row-info input-range' },
                            _react2.default.createElement(_reactInputRange2.default, {
                                step: 1,
                                maxValue: props.showFollowers.maxStep,
                                minValue: props.showFollowers.minStep,
                                value: props.showFollowers,
                                onChange: function onChange(value) {
                                    _actions2.default.changeFilter('showFollowers', value);
                                } })
                        )
                    )
                ),
                _react2.default.createElement(
                    'details',
                    { className: 'config-wrapper', open: true },
                    _react2.default.createElement(
                        'summary',
                        null,
                        'Config times'
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'config-options' },
                        _react2.default.createElement(
                            'div',
                            { className: 'row-info' },
                            'Wait between actions:',
                            _react2.default.createElement('input', { type: 'number', value: props.wait_between_actions,
                                onChange: function onChange(e) {
                                    _actions2.default.changeConfigure('wait_between_actions', e.target.value);
                                }
                            }),
                            'seconds'
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'row-info' },
                            _react2.default.createElement('input', { type: 'checkbox', defaultChecked: props.is_random, onChange: function onChange(e) {
                                    _actions2.default.changeConfigure('is_random', e.target.value);
                                } }),
                            'Randomize wait time by up to:',
                            _react2.default.createElement('input', { type: 'number', value: props.random_wait,
                                onChange: function onChange(e) {
                                    _actions2.default.changeConfigure('random_wait', e.target.value);
                                }
                            }),
                            '%'
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'row-info' },
                            'Wait after "soft" rate limit:',
                            _react2.default.createElement('input', { type: 'number', value: props.wait_minus_after_sort,
                                onChange: function onChange(e) {
                                    _actions2.default.changeConfigure('wait_minus_after_sort', e.target.value);
                                }
                            }),
                            'minutes'
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'multi-actions-button', onClick: function onClick(e) {
                            if (_this2.props.loading_follow_list_user) return;
                            _actions2.default.setShowFollowed(false);
                            _actions2.default.followAll();
                        } },
                    _react2.default.createElement(
                        'span',
                        null,
                        props.loading_follow_list_user ? _react2.default.createElement('i', { className: 'fa fa-spinner fa-pulse fa-fw' }) : null,
                        'Follow all'
                    )
                )
            );
        }
    }]);

    return RightPanel;
}(_react2.default.Component), function (appState) {
    var configure = appState.configure;
    return {
        loading_get_list_user: appState.loading_get_list_user,
        loading_follow_list_user: appState.loading_follow_list_user,
        showFollowers: appState.filter.showFollowers,
        showFollowed: appState.filter.showFollowed,
        limit: appState.filter.limit,
        keywords: appState.filter.keywords,
        is_random: configure.is_random,
        random_wait: configure.random_wait,
        wait_between_actions: configure.wait_between_actions,
        wait_minus_after_sort: configure.wait_minus_after_sort
    };
});
exports.default = RightPanel;

/***/ })

},[75]);