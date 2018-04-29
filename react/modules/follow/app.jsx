import React from 'react';
import ReactDom from 'react-dom';
import {OAuth} from 'oauthio-web';
import Store from "./flux/store";
import Action from "./flux/actions";
import ListFollow from './components/list-follow'

const App = Store.connect(class App extends React.Component {
    constructor() {
        super();
        this.openPopup = this.openPopup.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    componentDidMount() {
        console.log('didmount')
    }

    componentWillUnmount() {
        console.log('willmount')
    }

    onLogin() {
        console.log('ádd', this.props);
        let publicKey = this.props.publicKey; //demo
        let loginTo = this.props.loginTo;
        OAuth.initialize(publicKey);

        OAuth.popup(loginTo).then(instagram => {
            console.log('instagram:', instagram);
            instagram.me().then(data => {
                console.log('me data:', data);
                alert('Instagram says your name is ' + data.name + ".\nView browser 'Console Log' for more details");
            });

            instagram.get('/v1/users/self').then(data => {
                console.log('self data:', data);
            })
        }).fail((ex) => {
            console.warn(ex)
        })
    }

    render() {
        return (
            <ListFollow/>
        )
        return (
            <div className="follow-container">
                <h1 className="follow-icon follow-icon-instagram">

                </h1>
                <a id="instagram-button" className="btn btn-block btn-social btn-instagram" onClick={Action.onLogin}>
                    <i className="fa fa-instagram"/> Sign in with Instagram
                </a>
            </div>
        )
    }

    openPopup() {
        let url = `https://api.instagram.com/oauth/authorize/?client_id=${this.state.clientId}&redirect_uri=${this.state.redirectUri}&response_type=code`,
            title = 'Login Instagram',
            wLeft = window.screenLeft ? window.screenLeft : window.screenX,
            wTop = window.screenTop ? window.screenTop : window.screenY,
            w = 500,
            h = 500,
            left = wLeft + (window.innerWidth / 2) - (w / 2),
            top = wTop + (window.innerHeight / 2) - (h / 2);
        return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    }
}, appState => {
    console.log('--', appState);
    return {
        loginTo: appState.loginTo,
        publicKey: appState.publicKey
    }
})


ReactDom.render(<App/>, document.getElementById('follow-instagram-310594'));