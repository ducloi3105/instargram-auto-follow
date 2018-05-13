import axios from 'axios';

export default {
    url(query_hash, userId, first,after) {
        if(after){
            return `https://www.instagram.com/graphql/query/?query_hash=${query_hash}&variables={"id":"${userId}","first":${first},"after":"${after}"}`

        }
        return `https://www.instagram.com/graphql/query/?query_hash=${query_hash}&variables={"id":"${userId}","first":${first}}`
    },

    getListFollow(payload) {
        return axios.get(this.url(payload.query_hash, payload.userId, payload.first, payload.after))
    },

    getUserIdFromUrl(url) {
        return axios.get(url)
    },

    followAll(userId,token){
        return axios.post(`https://www.instagram.com/web/friendships/${userId}/follow/`, null, {
            headers: {
                "x-csrftoken": token,
                "x-instagram-ajax": 1,
                "x-requested-with": "XMLHttpRequest"
            }
        })
    },
    unfollowAll(userId, token) {
        return axios.post(`https://www.instagram.com/web/friendships/${userId}/unfollow/`, null, {
            headers: {
                "x-csrftoken": token,
                "x-instagram-ajax": 1,
                "x-requested-with": "XMLHttpRequest"
            }
        })
    },

    getMoreDataUser(url) {
        return axios.get(url)
    }
}