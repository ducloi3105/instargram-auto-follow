import Store from './store';
import {OAuth} from "oauthio-web";

const Actions = {
    setAppProps(appProps) {
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
    onLogin() {
        let state = Store.getState();
        let publicKey = state.publicKey; //demo
        let loginTo = state.loginTo;
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
};

export default Actions;