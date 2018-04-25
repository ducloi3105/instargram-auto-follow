webpackJsonp([2],{

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(9);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _oauthioWeb = __webpack_require__(34);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

        _this.state = {
            clientId: 'c7ae8feae5d64411b5e28a0c1f06fa1b',
            redirectUri: 'http://192.168.60.73:1234/auth/instagram/callback'
        };
        _this.openPopup = _this.openPopup.bind(_this);
        _this.onLogin = _this.onLogin.bind(_this);
        return _this;
    }

    _createClass(App, [{
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
    }, {
        key: 'onLogin',
        value: function onLogin() {
            console.log('ádd');
            var publicKey = '1q65G1o9uDePDgZXhIt7xEgaL-A'; //demo
            var loginTo = 'instagram';
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
            return _react2.default.createElement(
                'div',
                { className: 'follow-container' },
                _react2.default.createElement(
                    'a',
                    { id: 'instagram-button', className: 'btn btn-block btn-social btn-instagram', onClick: this.onLogin },
                    _react2.default.createElement('i', { className: 'fa fa-instagram' }),
                    ' Sign in with Instagram'
                )
            );
        }
    }]);

    return App;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('follow'));

/***/ })

},[33]);