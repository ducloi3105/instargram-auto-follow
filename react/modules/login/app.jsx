import React from 'react';
import ReactDom from 'react-dom';
import Store from './flux/store';
import Actions from './flux/actions';
import Login from './components/login';
import Otp from './components/Otp';
import ValidateOtp from './components/validate-otp';

var App = Store.connect(class App extends React.Component {
    componentDidMount() {
        Actions.setAppProps(this.props);
        Actions.setCaptchaImg(this.props.captcharUrl);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps) !== JSON.stringify(this.props))
            Actions.setAppProps(nextProps);
    }

    render() {
        var cls = "login-wrap " /*+ this.state.skin*/;

        return (
            <div className={cls}>
                <form>
                    <div style={{maxHeight: '12%', flexGrow: '1'}}/>
                    <div className="logo"/>
                    <div className="break-line"/>
                    {
                        this.props.formType == 'getOtp' ? <Otp/> : (
                            this.props.formType == 'validateOtp' ? <ValidateOtp/> : <Login/>
                        )
                    }
                    <div style={{flexGrow: 1}}/>
                    <div className="copyright">© {new Date().getFullYear()} ChannelVN</div>
                    <div style={{height: '5.6%'}}/>
                </form>
                <div className="slogan"/>
            </div>
        );
    }
}, appState => {
    return {
        formType: appState.formType,
    };
});

window.React.renderLoginForm = function (props) {
    ReactDom.render(<App {...props}/>, document.getElementById('login_wrap'));
}