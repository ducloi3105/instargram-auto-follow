import createStore from '../../common/create-store';

var state = {
    txtUserName: '',
    txtPassWords: '',
    txtCaptcha: '',
    chkSavePassword: false,
    errorMessage: '',
    processing: false,
    captchaImg: '',
    skin: 'skin-' + Math.floor((Math.random() * 8) + 1),
    formType: 'login',
    qrImg: '',
    otpType: 'QRCode',
    otpCode: '',
    appProps: {}
};

export default createStore(state);

