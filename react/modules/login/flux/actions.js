import Store from './store';
import API from '../api';

const Actions = {
    setAppProps(appProps){
        Store.setState(state => {
            Object.assign(state.appProps, appProps);
            return state;
        });
    },
    setCaptchaImg(captchaUrl) {
        Store.setState(state => {
            state.captchaImg = captchaUrl + '?t=' + new Date().getTime();
            return state;
        });
    },
    changeInput(which, value) {
        Store.setState(state => {
            state[which] = value;
            return state;
        });
    },
    reloadCaptcha() {
        Store.setState(state => {
            state.captchaImg = state.appProps.captcharUrl + '?t=' + new Date().getTime();
            return state;
        });
    },

    changeOtpCode(val){
        Store.setState(state => {
            state.otpCode = val;
            return state;
        });
    },

    getOTPCode(verifyToken, type) {
        Store.setState(state => {
            if (!state.processing) {
                if (type == 'QRCode' && state.qrImg != '') {
                    state.errorMessage = "Vui lòng quét mã QRCode.";
                }
                else {
                    state.otpType = type;
                }
            }
            return state;
        });
        this.getOtp(verifyToken, type);
    },

    handleSubmit(verifyToken) {
        var self = this;
        var state = Store.getState();

        if (!state.processing) {
            if(state.formType=='getOtp' || state.formType=='validateOtp'){

                if (state.otpCode == "") {
                    Store.setState(state => {
                        state.errorMessage = 'Vui lòng nhập mã OTP.';
                        return state;
                    });
                    return false;
                }

                this.validateOtp(verifyToken);
            }
            else{
                var userName = state.txtUserName,
                    password = state.txtPassWords,
                    captcha = state.txtCaptcha;

                if (!userName) {
                    Store.setState(state => {
                        state.errorMessage = 'Vui lòng nhập tên đăng nhập.';
                        return state;
                    });
                    return false;
                }
                if (!password) {

                    Store.setState(state => {
                        state.errorMessage = 'Vui lòng nhập mật khẩu.';
                        return state;
                    });
                    return false;
                }
                if (!captcha) {
                    Store.setState(state => {
                        state.errorMessage = 'Vui lòng nhập mã xác nhận.';
                        return state;
                    });
                    return false;
                }
            }
        }
        return true;//prevent submit form
    },

    login (verifyToken) {
        if(!this.handleSubmit(verifyToken)) return;
        Store.setState(state => {
            state.processing = true;
            state.errorMessage = '';
            return state;
        });
        let rs = (data) => {
            Store.setState(state => {
                if(data.data == state.txtUserName){
                    if (data.errorCode == 4001) {
                        state.processing = false;
                        state.formType = 'getOtp';
                    }
                    else {
                        state.processing = false;
                        state.formType = 'validateOtp';
                    }
                } else {
                    if (typeof data.content != 'undefined' && data.content != '')
                        window.location.href = data.content;
                    else
                        window.location.href = "/";
                }
                return state;
            });
        };
        let rj = (data) => {
            Store.setState(state => {
                if (data.errorCode == 401) {
                    //hết session captcha, reload captcha
                    state.captchaImg = state.appProps.captcharUrl + '?t=' + new Date().getTime();
                    state.errorMessage = "Vui lòng nhập lại mã xác nhận.";
                }
                else {
                    state.errorMessage = data.message;
                }
                state.processing = false;
                return state;
            });
        };
        let state = Store.getState();
        let params = {
            url: state.appProps.actionUrl,
            verifyToken: verifyToken,
            userName: state.txtUserName,
            password: state.txtPassWords,
            remember: state.chkSavePassword,
            captcha: state.txtCaptcha
        };
        API.login(params).then(rs,rj)
    },

    getOtp (verifyToken, type) {
        Store.setState(state => {
            state.processing = true;
            return state;
        });
        let rs = (data) => {
            Store.setState(state => {
                state.processing = false;
                state.qrImg = data.content;
                state.errorMessage = 'Quét mã QRCode bằng ứng dụng OTP của bạn.';
                return state;
            });
        };
        let rj = (data) => {
            Store.setState(state => {
                state.processing = false;
                state.qrImg = '';
                state.errorMessage = data.message;
                return state;
            });
        };
        API.getOtp({verifyToken, type}).then(rs,rj)
    },

    validateOtp (verifyToken) {

        let rs = (data) => {
            if (typeof data.content != 'undefined' && data.content != '')
                window.location.href = data.content;
            else
                window.location.href = "/";
        };
        let rj = (data) => {
            Store.setState(state => {
                state.processing = false;
                state.qrImg = '';
                state.errorMessage = data.message;
                return state;
            });
        };
        var state = Store.getState();
        API.validateOtp({
            verifyToken: verifyToken,
            otp: state.otpCode,
            type: state.otpType,
        }).then(rs,rj)

    },
};

export default Actions;