import Store from './store';
import {OAuth} from "oauthio-web";
import API from '../API'

let instagramFunc;
const Actions = {
    instagramFunc() {
        return instagramFunc;
    },
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
            instagramFunc = instagram;
            instagram.me().then(data => {
                console.log('me data:', data);
                data.access_token = instagram.access_token;

                Store.setState(state => {
                    state.instagramData = data;
                    return state;
                });

                API.getListFollow({
                    token: data.access_token,
                    userId: data.id
                }).then((data) => {
                    console.log(data)
                }).catch((ex) => {
                    console.log(ex)
                    if(ex.response){
                        console.log(ex.response)
                    }
                });
                // alert('Instagram says your name is ' + data.name + ".\nView browser 'Console Log' for more details");
            });
            //
            // instagram.get('/v1/users/self/').then(data => {
            //     console.log('self data:', data);
            //
            //
            // })
        }).fail((ex) => {
            console.warn(ex)
        })
    },

    getUserIdFromUrl(){
        let href = '';
        let url = window.location.origin;
        let userName = window.location.pathname.split('/');
        if (userName.length > 1) {
            userName = userName[1];
            href = url + '/' + userName;
            API.getUserIdFromUrl(href).then(data=>{
                data = JSON.parse(data.split("window._sharedData = ")[1].split(";</script>")[0]).entry_data.ProfilePage[0].graphql;
                console.log(data);
            }).catch(ex=>{
                console.warn('Get userid faile: ',ex)
            })

        }
    }
};

export default Actions;