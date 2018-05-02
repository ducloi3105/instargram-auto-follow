webpackJsonp([1],{

/***/ 103:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(6);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _store = __webpack_require__(8);

var _store2 = _interopRequireDefault(_store);

var _actions = __webpack_require__(15);

var _actions2 = _interopRequireDefault(_actions);

var _login = __webpack_require__(105);

var _login2 = _interopRequireDefault(_login);

var _otp = __webpack_require__(106);

var _otp2 = _interopRequireDefault(_otp);

var _validateOtp = __webpack_require__(107);

var _validateOtp2 = _interopRequireDefault(_validateOtp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = _store2.default.connect(function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
    }

    _createClass(App, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            _actions2.default.setAppProps(this.props);
            _actions2.default.setCaptchaImg(this.props.captcharUrl);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) _actions2.default.setAppProps(nextProps);
        }
    }, {
        key: 'render',
        value: function render() {
            var cls = "login-wrap " /*+ this.state.skin*/;

            return _react2.default.createElement(
                'div',
                { className: cls },
                _react2.default.createElement(
                    'form',
                    null,
                    _react2.default.createElement('div', { style: { maxHeight: '12%', flexGrow: '1' } }),
                    _react2.default.createElement('div', { className: 'logo' }),
                    _react2.default.createElement('div', { className: 'break-line' }),
                    this.props.formType == 'getOtp' ? _react2.default.createElement(_otp2.default, null) : this.props.formType == 'validateOtp' ? _react2.default.createElement(_validateOtp2.default, null) : _react2.default.createElement(_login2.default, null),
                    _react2.default.createElement('div', { style: { flexGrow: 1 } }),
                    _react2.default.createElement(
                        'div',
                        { className: 'copyright' },
                        '\xA9 ',
                        new Date().getFullYear(),
                        ' ChannelVN'
                    ),
                    _react2.default.createElement('div', { style: { height: '5.6%' } })
                ),
                _react2.default.createElement('div', { className: 'slogan' })
            );
        }
    }]);

    return App;
}(_react2.default.Component), function (appState) {
    return {
        formType: appState.formType
    };
});

window.React.renderLoginForm = function (props) {
    _reactDom2.default.render(_react2.default.createElement(App, props), document.getElementById('login_wrap'));
};

/***/ }),

/***/ 104:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function postData(options) {
    return new Promise(function (resolve, reject) {

        var url = typeof options.url != 'undefined' && options.url != '' ? options.url : '/Authenticate/' + options.action;
        var fetchOpts = {
            method: options.method || 'POST',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
        };

        if (options.params) {
            if (fetchOpts.method == 'GET') {
                fetchOpts.body = JSON.stringify(options.params);
            } else {
                if ('FormData' in window && FormData.prototype.isPrototypeOf(options.params)) {
                    fetchOpts.body = options.params;
                } else {
                    if (_typeof(options.params) == 'object') {
                        var strParams = "";
                        for (var key in options.params) {
                            if (strParams != "") {
                                strParams += "&";
                            }

                            if (options.params[key] instanceof Date) {
                                strParams += key + "=" + encodeURIComponent(dateFormat(options.params[key], 'dd/mm/yyyy HH:MM'));
                            } else {
                                strParams += key + "=" + encodeURIComponent(options.params[key]);
                            }
                        }
                        fetchOpts.body = strParams;
                    } else {
                        fetchOpts.body = options.params;
                    }
                }
            }
        }

        fetch(url, fetchOpts).then(function (response) {
            if (response.ok) {
                // Convert to JSON
                return response.json();
            } else {
                return {
                    Success: false,
                    Message: response,
                    ErrorCode: response.status
                };
            }
        }).then(function (jsonData) {
            resolve(jsonData);
        }).catch(function (error) {
            // If there is any error you will catch them here
            console.log('fetch data by url "' + url + '" error ' + error);
            reject({ Success: false, Message: 'Xảy ra lỗi khi gửi yêu cầu lên server' });
        });
    });
}
exports.default = {
    action: 'api/extension/boxbottomembed/',

    getOtp: function getOtp(payload) {
        return new Promise(function (rs, rj) {
            return postData({
                action: 'GetOTPCode',
                params: {
                    __RequestVerificationToken: payload.verifyToken,
                    otpType: payload.type
                }
            }).then(function (jsonData) {
                if (jsonData.Success) {
                    rs({
                        data: jsonData.Data,
                        content: jsonData.Content,
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
            }).catch(function (rj) {
                rj({ message: 'Lỗi gửi yêu cầu lên server' });
            });
        });
    },
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
    },
    validateOtp: function validateOtp(payload) {
        return new Promise(function (rs, rj) {
            return postData({
                action: 'ValidateOtp',
                params: {
                    verifyToken: payload.verifyToken,
                    __RequestVerificationToken: payload.verifyToken,
                    otp: payload.otp,
                    otpType: payload.type
                }
            }).then(function (jsonData) {
                if (jsonData.Success) {
                    rs({
                        data: jsonData.Data,
                        content: jsonData.Content,
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
                rj({ message: 'Lỗi gửi yêu cầu lên server' });
            });
        });
    }
};

/***/ }),

/***/ 105:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _store = __webpack_require__(8);

var _store2 = _interopRequireDefault(_store);

var _actions = __webpack_require__(15);

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Login = _store2.default.connect(function (_React$Component) {
    _inherits(Login, _React$Component);

    function Login() {
        _classCallCheck(this, Login);

        return _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).apply(this, arguments));
    }

    _createClass(Login, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                { className: 'form-wrap' },
                _react2.default.createElement(
                    'div',
                    { className: 'Message' },
                    'Ch\xE0o b\u1EA1n,',
                    _react2.default.createElement('br', null),
                    'M\u1EDDi b\u1EA1n \u0111\u0103ng nh\u1EADp th\xF4ng tin',
                    _react2.default.createElement(
                        'div',
                        { className: 'validation-summary-errors' },
                        this.props.errorMessage
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'info-wrap' },
                    _react2.default.createElement('input', { placeholder: 'T\xEAn \u0111\u0103ng nh\u1EADp', type: 'text', name: 'username', value: this.props.txtUserName,
                        onChange: function onChange(e) {
                            return _actions2.default.changeInput('txtUserName', e.target.value);
                        }
                    }),
                    _react2.default.createElement('input', { placeholder: 'M\u1EADt kh\u1EA9u', type: 'password', name: 'password', value: this.props.txtPassWords,
                        onChange: function onChange(e) {
                            return _actions2.default.changeInput('txtPassWords', e.target.value);
                        } })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'captcha-wrap' },
                    _react2.default.createElement('input', { placeholder: 'M\xE3 x\xE1c nh\u1EADn', type: 'text', name: 'captcha', autoComplete: 'off', value: this.props.txtCaptcha,
                        onChange: function onChange(e) {
                            return _actions2.default.changeInput('txtCaptcha', e.target.value);
                        } }),
                    _react2.default.createElement(
                        'div',
                        { className: 'Captcha' },
                        _react2.default.createElement('img', { src: this.props.captchaImg, alt: '' }),
                        _react2.default.createElement('span', { className: 'IconF5', title: 'L\u1EA5y m\xE3 m\u1EDBi', onClick: _actions2.default.reloadCaptcha })
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'Options' },
                    _react2.default.createElement('input', { checked: this.props.chkSavePassword, type: 'checkbox', id: 'chkSavePassword', onChange: function onChange() {
                            _actions2.default.changeInput('chkSavePassword', !_this2.props.chkSavePassword);
                        } }),
                    _react2.default.createElement(
                        'label',
                        { htmlFor: 'chkSavePassword' },
                        'Ghi nh\u1EDB m\u1EADt kh\u1EA9u'
                    )
                ),
                _react2.default.createElement('input', { className: 'btn-submit', type: 'button', value: '\u0110\u0103ng nh\u1EADp', onClick: function onClick(ev) {
                        var verifyToken = (document.querySelector('input[name="__RequestVerificationToken"]') || {}).value;
                        _actions2.default.login(verifyToken);
                    } }),
                this.props.processing ? _react2.default.createElement(
                    'div',
                    { className: 'loading-three-bounce' },
                    _react2.default.createElement('span', { className: 'dot dot1' }),
                    _react2.default.createElement('span', { className: 'dot dot2' }),
                    _react2.default.createElement('span', { className: 'dot dot3' })
                ) : null
            );
        }
    }]);

    return Login;
}(_react2.default.Component), function (appState) {
    return {
        txtUserName: appState.txtUserName,
        txtPassWords: appState.txtPassWords,
        txtCaptcha: appState.txtCaptcha,
        captchaImg: appState.captchaImg,
        chkSavePassword: appState.chkSavePassword,
        processing: appState.processing,
        errorMessage: appState.errorMessage,
        formType: appState.formType,
        otpCode: appState.otpCode
    };
});

exports.default = Login;

/***/ }),

/***/ 106:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _store = __webpack_require__(8);

var _store2 = _interopRequireDefault(_store);

var _actions = __webpack_require__(15);

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Opt = _store2.default.connect(function (_React$Component) {
    _inherits(Opt, _React$Component);

    function Opt() {
        _classCallCheck(this, Opt);

        return _possibleConstructorReturn(this, (Opt.__proto__ || Object.getPrototypeOf(Opt)).apply(this, arguments));
    }

    _createClass(Opt, [{
        key: 'onGetOtpCode',
        value: function onGetOtpCode(type) {
            var verifyToken = (document.querySelector('input[name="__RequestVerificationToken"]') || {}).value;
            _actions2.default.getOTPCode(verifyToken, type);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                { className: 'form-wrap' },
                _react2.default.createElement(
                    'div',
                    { className: 'Message' },
                    'Ch\xE0o b\u1EA1n,',
                    _react2.default.createElement('br', null),
                    'M\u1EDDi b\u1EA1n ch\u1ECDn ph\u01B0\u01A1ng th\u1EE9c nh\u1EADn m\xE3 OTP',
                    _react2.default.createElement(
                        'div',
                        { className: 'validation-summary-errors' },
                        this.props.errorMessage
                    )
                ),
                this.props.qrImg != "" ? _react2.default.createElement('div', { className: 'qrcode-img', dangerouslySetInnerHTML: { __html: this.props.qrImg } }) : null,
                _react2.default.createElement(
                    'div',
                    { className: 'info-wrap' },
                    _react2.default.createElement(
                        'div',
                        { className: 'otp-method' },
                        _react2.default.createElement(
                            'span',
                            { onClick: function onClick() {
                                    _this2.onGetOtpCode('QRCode');
                                } },
                            '1.Qu\xE9t m\xE3 QR code b\u1EB1ng \u1EE9ng d\u1EE5ng OTP'
                        ),
                        _react2.default.createElement(
                            'a',
                            { href: 'https://ims.mediacdn.vn/imsv2/Statics/help/otp/index.html', target: '_blank', title: 'Xem h\u01B0\u1EDBng d\u1EABn' },
                            _react2.default.createElement('i', { className: 'icon-help' })
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'otp-method' },
                        _react2.default.createElement(
                            'span',
                            { onClick: function onClick() {
                                    _this2.onGetOtpCode('SMS');
                                } },
                            '2.Nh\u1EADn m\xE3 OTP qua tin nh\u1EAFn SMS.'
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'info-wrap' },
                    _react2.default.createElement('input', { placeholder: 'Nh\u1EADp m\xE3 OTP c\u1EE7a b\u1EA1n...', type: 'text', name: 'getOTP', autoComplete: 'off', value: this.props.otpCode,
                        onChange: function onChange(ev) {
                            _actions2.default.changeOtpCode(ev.target.value);
                        } })
                ),
                _react2.default.createElement('input', { className: 'btn-submit', type: 'button', value: 'X\xE1c nh\u1EADn', onClick: function onClick(ev) {
                        var verifyToken = (document.querySelector('input[name="__RequestVerificationToken"]') || {}).value;
                        _actions2.default.validateOtp(verifyToken);
                    } }),
                this.props.processing ? _react2.default.createElement(
                    'div',
                    { className: 'loading-three-bounce' },
                    _react2.default.createElement('span', { className: 'dot dot1' }),
                    _react2.default.createElement('span', { className: 'dot dot2' }),
                    _react2.default.createElement('span', { className: 'dot dot3' })
                ) : null
            );
        }
    }]);

    return Opt;
}(_react2.default.Component), function (appState) {
    return {
        qrImg: appState.qrImg,
        otpCode: appState.otpCode,
        processing: appState.processing,
        errorMessage: appState.errorMessage
    };
});

exports.default = Opt;

/***/ }),

/***/ 107:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _store = __webpack_require__(8);

var _store2 = _interopRequireDefault(_store);

var _actions = __webpack_require__(15);

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Opt = _store2.default.connect(function (_React$Component) {
    _inherits(Opt, _React$Component);

    function Opt() {
        _classCallCheck(this, Opt);

        return _possibleConstructorReturn(this, (Opt.__proto__ || Object.getPrototypeOf(Opt)).apply(this, arguments));
    }

    _createClass(Opt, [{
        key: 'onGetOtpCode',
        value: function onGetOtpCode(type) {
            var verifyToken = (document.querySelector('input[name="__RequestVerificationToken"]') || {}).value;
            _actions2.default.getOTPCode(verifyToken, type);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                { className: 'form-wrap' },
                _react2.default.createElement(
                    'div',
                    { className: 'Message' },
                    'Ch\xE0o b\u1EA1n,',
                    _react2.default.createElement('br', null),
                    'M\u1EDDi b\u1EA1n nh\u1EADp m\xE3 OTP tr\xEAn \u1EE9ng d\u1EE5ng OTP c\u1EE7a b\u1EA1n',
                    _react2.default.createElement(
                        'div',
                        { className: 'validation-summary-errors' },
                        this.props.errorMessage
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'info-wrap' },
                    _react2.default.createElement(
                        'div',
                        { className: 'otp-method' },
                        _react2.default.createElement(
                            'span',
                            { onClick: function onClick() {
                                    _this2.onGetOtpCode('SMS');
                                } },
                            'Ho\u1EB7c Click v\xE0o \u0111\xE2y \u0111\u1EC3 nh\u1EADn m\xE3 OTP qua tin nh\u1EAFn SMS.'
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'info-wrap' },
                    _react2.default.createElement('input', { placeholder: 'Nh\u1EADp m\xE3 OTP c\u1EE7a b\u1EA1n...', type: 'text', name: 'otp', autoComplete: 'off',
                        value: this.props.otpCode,
                        onChange: function onChange(ev) {
                            _actions2.default.changeOtpCode(ev.target.value);
                        } })
                ),
                _react2.default.createElement('input', { className: 'btn-submit', type: 'button', value: 'X\xE1c nh\u1EADn', onClick: function onClick() {
                        var verifyToken = (document.querySelector('input[name="__RequestVerificationToken"]') || {}).value;
                        _actions2.default.validateOtp(verifyToken);
                    } }),
                this.props.processing ? _react2.default.createElement(
                    'div',
                    { className: 'loading-three-bounce' },
                    _react2.default.createElement('span', { className: 'dot dot1' }),
                    _react2.default.createElement('span', { className: 'dot dot2' }),
                    _react2.default.createElement('span', { className: 'dot dot3' })
                ) : null
            );
        }
    }]);

    return Opt;
}(_react2.default.Component), function (appState) {
    return {
        otpCode: appState.otpCode,
        processing: appState.processing,
        errorMessage: appState.errorMessage
    };
});

exports.default = Opt;

/***/ }),

/***/ 15:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _store = __webpack_require__(8);

var _store2 = _interopRequireDefault(_store);

var _api = __webpack_require__(104);

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Actions = {
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
    changeInput: function changeInput(which, value) {
        _store2.default.setState(function (state) {
            state[which] = value;
            return state;
        });
    },
    reloadCaptcha: function reloadCaptcha() {
        _store2.default.setState(function (state) {
            state.captchaImg = state.appProps.captcharUrl + '?t=' + new Date().getTime();
            return state;
        });
    },
    changeOtpCode: function changeOtpCode(val) {
        _store2.default.setState(function (state) {
            state.otpCode = val;
            return state;
        });
    },
    getOTPCode: function getOTPCode(verifyToken, type) {
        _store2.default.setState(function (state) {
            if (!state.processing) {
                if (type == 'QRCode' && state.qrImg != '') {
                    state.errorMessage = "Vui lòng quét mã QRCode.";
                } else {
                    state.otpType = type;
                }
            }
            return state;
        });
        this.getOtp(verifyToken, type);
    },
    handleSubmit: function handleSubmit(verifyToken) {
        var self = this;
        var state = _store2.default.getState();

        if (!state.processing) {
            if (state.formType == 'getOtp' || state.formType == 'validateOtp') {

                if (state.otpCode == "") {
                    _store2.default.setState(function (state) {
                        state.errorMessage = 'Vui lòng nhập mã OTP.';
                        return state;
                    });
                    return false;
                }

                this.validateOtp(verifyToken);
            } else {
                var userName = state.txtUserName,
                    password = state.txtPassWords,
                    captcha = state.txtCaptcha;

                if (!userName) {
                    _store2.default.setState(function (state) {
                        state.errorMessage = 'Vui lòng nhập tên đăng nhập.';
                        return state;
                    });
                    return false;
                }
                if (!password) {

                    _store2.default.setState(function (state) {
                        state.errorMessage = 'Vui lòng nhập mật khẩu.';
                        return state;
                    });
                    return false;
                }
                if (!captcha) {
                    _store2.default.setState(function (state) {
                        state.errorMessage = 'Vui lòng nhập mã xác nhận.';
                        return state;
                    });
                    return false;
                }
            }
        }
        return true; //prevent submit form
    },
    login: function login(verifyToken) {
        if (!this.handleSubmit(verifyToken)) return;
        _store2.default.setState(function (state) {
            state.processing = true;
            state.errorMessage = '';
            return state;
        });
        var rs = function rs(data) {
            _store2.default.setState(function (state) {
                if (data.data == state.txtUserName) {
                    if (data.errorCode == 4001) {
                        state.processing = false;
                        state.formType = 'getOtp';
                    } else {
                        state.processing = false;
                        state.formType = 'validateOtp';
                    }
                } else {
                    if (typeof data.content != 'undefined' && data.content != '') window.location.href = data.content;else window.location.href = "/";
                }
                return state;
            });
        };
        var rj = function rj(data) {
            _store2.default.setState(function (state) {
                if (data.errorCode == 401) {
                    //hết session captcha, reload captcha
                    state.captchaImg = state.appProps.captcharUrl + '?t=' + new Date().getTime();
                    state.errorMessage = "Vui lòng nhập lại mã xác nhận.";
                } else {
                    state.errorMessage = data.message;
                }
                state.processing = false;
                return state;
            });
        };
        var state = _store2.default.getState();
        var params = {
            url: state.appProps.actionUrl,
            verifyToken: verifyToken,
            userName: state.txtUserName,
            password: state.txtPassWords,
            remember: state.chkSavePassword,
            captcha: state.txtCaptcha
        };
        _api2.default.login(params).then(rs, rj);
    },
    getOtp: function getOtp(verifyToken, type) {
        _store2.default.setState(function (state) {
            state.processing = true;
            return state;
        });
        var rs = function rs(data) {
            _store2.default.setState(function (state) {
                state.processing = false;
                state.qrImg = data.content;
                state.errorMessage = 'Quét mã QRCode bằng ứng dụng OTP của bạn.';
                return state;
            });
        };
        var rj = function rj(data) {
            _store2.default.setState(function (state) {
                state.processing = false;
                state.qrImg = '';
                state.errorMessage = data.message;
                return state;
            });
        };
        _api2.default.getOtp({ verifyToken: verifyToken, type: type }).then(rs, rj);
    },
    validateOtp: function validateOtp(verifyToken) {

        var rs = function rs(data) {
            if (typeof data.content != 'undefined' && data.content != '') window.location.href = data.content;else window.location.href = "/";
        };
        var rj = function rj(data) {
            _store2.default.setState(function (state) {
                state.processing = false;
                state.qrImg = '';
                state.errorMessage = data.message;
                return state;
            });
        };
        var state = _store2.default.getState();
        _api2.default.validateOtp({
            verifyToken: verifyToken,
            otp: state.otpCode,
            type: state.otpType
        }).then(rs, rj);
    }
};

exports.default = Actions;

/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createStore = __webpack_require__(11);

var _createStore2 = _interopRequireDefault(_createStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var state = {
    txtUserName: '',
    txtPassWords: '',
    txtCaptcha: '',
    chkSavePassword: false,
    errorMessage: '',
    processing: false,
    captchaImg: '',
    skin: 'skin-' + Math.floor(Math.random() * 8 + 1),
    formType: 'login',
    qrImg: '',
    otpType: 'QRCode',
    otpCode: '',
    appProps: {}
};

exports.default = (0, _createStore2.default)(state);

/***/ })

},[103]);