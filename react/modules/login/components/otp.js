import React from 'react';
import Store from '../flux/store';
import Actions from '../flux/actions';

const Opt = Store.connect(class Opt extends React.Component{

    onGetOtpCode(type){
        var verifyToken = (document.querySelector('input[name="__RequestVerificationToken"]')|| {}).value;
        Actions.getOTPCode(verifyToken, type)
    }

    render(){
        return(
            <div className="form-wrap">
                <div className="Message">
                    Chào bạn,<br />
                    Mời bạn chọn phương thức nhận mã OTP
                    <div className="validation-summary-errors">{this.props.errorMessage}</div>
                </div>
                {this.props.qrImg !="" ? <div className="qrcode-img" dangerouslySetInnerHTML={{ __html: this.props.qrImg }} />: null}
                <div className="info-wrap">
                    <div className="otp-method">
                        <span onClick={()=>{this.onGetOtpCode('QRCode');}}>1.Quét mã QR code bằng ứng dụng OTP</span>
                        <a href="https://ims.mediacdn.vn/imsv2/Statics/help/otp/index.html" target="_blank" title="Xem hướng dẫn">
                            <i className="icon-help"/>
                        </a>
                    </div>
                    <div className="otp-method">
                        <span onClick={()=>{this.onGetOtpCode('SMS');}}>2.Nhận mã OTP qua tin nhắn SMS.</span>
                    </div>
                    {/* <div className="otp-method"><span onClick={self.getOTPCode.bind(this,'Voice')}>3.Nhận mã OTP qua cuộc gọi.</span></div>
                    <div className="otp-method"><span onClick={self.getOTPCode.bind(this,'Email')}>4.Nhận mã OTP qua Email.</span></div> */}
                </div>
                <div className="info-wrap">
                    <input placeholder="Nhập mã OTP của bạn..." type="text" name="getOTP" autoComplete="off" value={this.props.otpCode}
                    onChange={ev=>{
                        Actions.changeOtpCode(ev.target.value)
                    }} />
                </div>
                <input className="btn-submit" type="button" value="Xác nhận" onClick={(ev) => {
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
        qrImg: appState.qrImg,
        otpCode: appState.otpCode,
        processing: appState.processing,
        errorMessage: appState.errorMessage,
    }
});

export default Opt;