import React from 'react';
import Store from '../flux/store';
import Actions from '../flux/actions';

const Login = Store.connect(class Login extends React.Component {

    render() {
        return(
            <div className="form-wrap">
                <div className="Message">
                    Chào bạn,<br />
                    Mời bạn đăng nhập thông tin
                    <div className="validation-summary-errors">
                        {this.props.errorMessage}
                    </div>
                </div>
                <div className="info-wrap">
                    <input placeholder="Tên đăng nhập" type="text" name="username" value={this.props.txtUserName}
                           onChange={(e)=> Actions.changeInput('txtUserName', e.target.value)}
                    />
                    <input placeholder="Mật khẩu" type="password" name="password"  value={this.props.txtPassWords}
                           onChange={(e)=> Actions.changeInput('txtPassWords', e.target.value)}/>
                </div>
                <div className="captcha-wrap">
                    <input placeholder="Mã xác nhận" type="text" name="captcha" autoComplete="off" value={this.props.txtCaptcha}
                           onChange={(e)=> Actions.changeInput('txtCaptcha', e.target.value)}/>
                    <div className="Captcha">
                        <img src={this.props.captchaImg} alt="" />
                        <span className="IconF5" title="Lấy mã mới" onClick={Actions.reloadCaptcha}/>
                    </div>
                </div>
                <div className="Options">
                    <input checked={this.props.chkSavePassword} type="checkbox" id="chkSavePassword" onChange={() => {
                        Actions.changeInput('chkSavePassword', !this.props.chkSavePassword)
                    }}/>
                    <label htmlFor="chkSavePassword">Ghi nhớ mật khẩu</label>
                </div>
                <input className="btn-submit" type="button" value="Đăng nhập" onClick={(ev) => {
                    var verifyToken = (document.querySelector('input[name="__RequestVerificationToken"]') || {}).value;
                    Actions.login(verifyToken);
                }}/>
                {
                    this.props.processing ? <div className="loading-three-bounce">
                        <span className="dot dot1"/>
                        <span className="dot dot2"/>
                        <span className="dot dot3"/>
                    </div> : null
                }
            </div>
        )
    }
}, appState => {
    return {
        txtUserName: appState.txtUserName,
        txtPassWords: appState.txtPassWords,
        txtCaptcha: appState.txtCaptcha,
        captchaImg: appState.captchaImg,
        chkSavePassword: appState.chkSavePassword,
        processing: appState.processing,
        errorMessage: appState.errorMessage,
        formType: appState.formType,
        otpCode: appState.otpCode,
    }
});

export default Login;