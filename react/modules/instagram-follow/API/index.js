import axios from 'axios';

export default {
    url(userId, token) {
        let first = 12;
        let id = "7094217709" // user ID
        let query_hash = "37479f2b8209594dde7facb0d904896a";
        return `https://www.instagram.com/graphql/query/?query_hash=${query_hash}&variables={"id":"${id}","first":${first}}`
    },

    getListFollow(payload) {
        return axios.get(encodeURI(this.url(payload.userId, payload.token)))
    },

    getUserIdFromUrl(url){
        return axios.get(url)
    }
}