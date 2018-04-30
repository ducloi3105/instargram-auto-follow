import Store from './store';
import {OAuth} from "oauthio-web";
import API from '../API'

const Actions = {
    getInfoAccount() {
        let url = window.location.origin;
        API.getUserIdFromUrl(url).then(data => {
            Store.setState(state => {
                try {
                    data = JSON.parse(data.data.split("window._sharedData = ")[1].split(";</script>")[0]);


                    state.infoAccount.token = data.config.csrf_token;
                    state.infoAccount.id = data.config.viewer.id;
                } catch (e) {
                    state.infoAccount.message = "Get info account (token, id)  failed";
                    console.warn("Get info account (token, id)  failed")
                }

                return state;
            })
        }).catch(ex => {
            console.warn("Get info account (token, id)  failed", ex)
        })
    },

    getSomeone(username) {
        if (!username) return console.warn('Typing username or redirect link to user.');
        let url = window.location.origin;
        url += '/' + username;
        API.getUserIdFromUrl(url).then(data => {
            Store.setState(state => {
                try {
                    data = JSON.parse(data.data.split("window._sharedData = ")[1].split(";</script>")[0]);
                    let ProfilePage=data.entry_data.ProfilePage;
                    if(ProfilePage.length>0){
                        let info=ProfilePage[0].graphql.user;
                        state.infoWho.username = info.username;
                        state.infoWho.id = info.id;
                    }
                    console.log(state)
                } catch (e) {
                    state.infoWho.message = "Get someone id  failed";
                    console.warn("Get someone id  failed")
                }

                return state;
            })
        }).catch(ex => {
            console.warn("Get someone id  failed", ex)
        })
    }
};

export default Actions;