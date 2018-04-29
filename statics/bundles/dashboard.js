webpackJsonp([2],{

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createStore = __webpack_require__(10);

var _createStore2 = _interopRequireDefault(_createStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var state = {

    appProps: {}
};

exports.default = (0, _createStore2.default)(state);

/***/ }),

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(9);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _store = __webpack_require__(17);

var _store2 = _interopRequireDefault(_store);

var _actions = __webpack_require__(34);

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dashboard = _store2.default.connect(function (_React$Component) {
    _inherits(Dashboard, _React$Component);

    function Dashboard() {
        _classCallCheck(this, Dashboard);

        return _possibleConstructorReturn(this, (Dashboard.__proto__ || Object.getPrototypeOf(Dashboard)).apply(this, arguments));
    }

    _createClass(Dashboard, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            _actions2.default.setAppProps(this.props);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) _actions2.default.setAppProps(nextProps);
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement('div', null);
            var self = this;
            //check role
            var widgetBoxs = [];
            var isSecretary = false,
                isEditor = false,
                isReporter = false,
                isStatistic = false,
                isFullPermission = typeof imsConfig != "undefined" && typeof imsConfig.userInfo != "undefined" && imsConfig.userInfo.IsFullPermission && imsConfig.userInfo.IsFullZone;

            if (typeof imsConfig != "undefined" && typeof imsConfig.userPermissions != "undefined") {
                var permissions = imsConfig.userPermissions;

                isSecretary = permissions.some(function (item) {
                    return item.PermissionId == enumPermissions.ArticleAdmin;
                });

                isEditor = permissions.some(function (item) {
                    return item.PermissionId == enumPermissions.ArticleEditor;
                });

                isReporter = permissions.some(function (item) {
                    return item.PermissionId == enumPermissions.ArticleReporter;
                });

                isStatistic = permissions.some(function (item) {
                    return item.PermissionId == enumPermissions.Statistic;
                });

                if (isSecretary || isFullPermission || isStatistic) {
                    widgetBoxs.push(_react2.default.createElement(StatisticRealtimeBox, { adtechNameSpace: self.props.adtechNameSpace }));
                }

                if (isSecretary || isFullPermission) {
                    widgetBoxs.push(_react2.default.createElement(ListNewsByStatusBox, { status: enumNewsStatus.WaitForPublish, title: 'B\xE0i ch\u1EDD xu\u1EA5t b\u1EA3n', key: "boxnews_" + enumNewsStatus.WaitForPublish })); //bài chờ xuất bản
                }

                if (isEditor || isFullPermission) {
                    widgetBoxs.push(_react2.default.createElement(ListNewsByStatusBox, { status: enumNewsStatus.WaitForEdit, title: 'B\xE0i ch\u1EDD bi\xEAn t\u1EADp', key: "boxnews_" + enumNewsStatus.WaitForEdit })); //bài chờ biên tập
                } else if (isReporter) {
                    widgetBoxs.push(_react2.default.createElement(ListNewsByStatusBox, { status: enumNewsStatus.ReturnedToReporter, title: 'B\xE0i b\u1ECB tr\u1EA3 l\u1EA1i', key: "boxnews_" + enumNewsStatus.ReturnedToReporter })); //bài bị trả lại
                }
            }

            return _react2.default.createElement(
                'div',
                { className: 'ims-page-wrap' },
                _react2.default.createElement(TopHeader, { title: 'Dashboard' }),
                _react2.default.createElement(
                    'div',
                    { className: 'ims-page-content ims-dasboard' },
                    widgetBoxs,
                    _react2.default.createElement(NewsHotBox, { top: 5, day: 7 }),
                    _react2.default.createElement(TagHotBox, null),
                    isSecretary || isFullPermission ? _react2.default.createElement(StatisticNewsYieldBox, null) : null
                )
            );
        }
    }]);

    return Dashboard;
}(_react2.default.Component), function (appState) {
    return {
        formType: appState.formType
    };
});

window.React.renderDashboard = function (props, el) {
    _reactDom2.default.render(_react2.default.createElement(Dashboard, props), el);
};

/***/ }),

/***/ 34:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _store = __webpack_require__(17);

var _store2 = _interopRequireDefault(_store);

var _api = __webpack_require__(35);

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Actions = {
    setAppProps: function setAppProps(appProps) {
        _store2.default.setState(function (state) {
            Object.assign(state.appProps, appProps);
            return state;
        });
    }
};

exports.default = Actions;

/***/ }),

/***/ 35:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    action: 'api/extension/boxbottomembed/',

    login: function login(payload) {
        return new Promise(function (rs, rj) {
            return postData({
                url: payload.url,
                params: {
                    __RequestVerificationToken: payload.verifyToken,
                    UserName: payload.userName,
                    Password: payload.password,
                    RememberMe: payload.remember,
                    Captcha: payload.captcha
                }
            }).then(function (jsonData) {
                if (jsonData.Success) {
                    rs({
                        data: jsonData.Data,
                        content: jsonData.Content,
                        message: jsonData.Message,
                        errorCode: jsonData.ErrorCode
                    });
                } else {
                    rj({
                        data: jsonData.Data,
                        content: jsonData.Content,
                        message: jsonData.Message,
                        errorCode: jsonData.ErrorCode
                    });
                }
            }).catch(function () {
                rs({
                    message: 'Lỗi gửi yêu cầu lên server'
                });
            });
        });
    }
};

/***/ })

},[20]);