import React from 'react';
import Store from '../flux/store';
import Actions from '../flux/actions';

const Opt = Store.connect(class Opt extends React.Component{

    onGetOtpCode(type){
        var verifyToken = (document.querySelector('input[name="__RequestVerificationToken"]')|| {}).value;
        Actions.getOTPCode(verifyToken, type)
    }

    render() {
        return (
            <div className="form-wrap">
                <div className="Message">
                    Chào bạn,<br/>
                    Mời bạn nhập mã OTP trên ứng dụng OTP của bạn
                    <div className="validation-summary-errors">{this.props.errorMessage}</div>
                </div>
                <div className="info-wrap">
                    <div className="otp-method">
                        <span onClick={() => {
                            this.onGetOtpCode('SMS');
                        }}>Hoặc Click vào đây để nhận mã OTP qua tin nhắn SMS.</span>
                    </div>
                </div>
                <div className="info-wrap">
                    <input placeholder="Nhập mã OTP của bạn..." type="text" name="otp" autoComplete="off"
                           value={this.props.otpCode}
                           onChange={ev => {
                               Actions.changeOtpCode(ev.target.value)
                           }}/>
                </div>
                <input className="btn-submit" type="button" value="Xác nhận" onClick={() => {
                    var verifyToken = (document.querySelector('input[name="__RequestVerificationToken"]') || {}).value;
                    Actions.validateOtp(verifyToken);
                }}/>
                {
                    this.props.processing ?
                        <div className="loading-three-bounce">
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
        otpCode: appState.otpCode,
        processing: appState.processing,
        errorMessage: appState.errorMessage,
    }
});

export default Opt;