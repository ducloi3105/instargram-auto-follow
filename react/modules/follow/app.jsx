import React from 'react';
import ReactDom from 'react-dom';
import {OAuth} from 'oauthio-web';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            clientId: 'c7ae8feae5d64411b5e28a0c1f06fa1b',
            redirectUri: 'http://192.168.60.73:1234/auth/instagram/callback',
        };
        this.openPopup = this.openPopup.bind(this);
        this.onLogin = this.onLogin.bind(this);
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

    onLogin() {
        console.log('ádd');
        let publicKey = '1q65G1o9uDePDgZXhIt7xEgaL-A'; //demo
        let loginTo = 'instagram';
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
            <div className="follow-container">

                <a id="instagram-button" className="btn btn-block btn-social btn-instagram" onClick={this.onLogin}>
                    <i className="fa fa-instagram"/> Sign in with Instagram
                </a>
            </div>
        )
    }
}


ReactDom.render(<App/>, document.getElementById('follow'));