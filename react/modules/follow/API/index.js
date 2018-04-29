import axios from 'axios';

export default {
    url(userId, token) {
        return `https://api.instagram.com/v1/users/${userId}/follows?access_token=${token}`
    },
    getListFollow(payload) {
        return axios.get(this.url(payload.userId, payload.token))
    },
}