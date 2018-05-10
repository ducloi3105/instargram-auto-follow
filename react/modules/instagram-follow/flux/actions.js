import Store from './store';
import {OAuth} from "oauthio-web";
import API from '../API'
import Utils from '../../common/utils'

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
    pressUserId(userId) {
        Store.setState(state => {
            state.dataFollow.listUser = [];
            state.dataFollow.total = 0;
            state.loading_get_list_user = true;
            return state;
        });
        this.getSomeone(userId)
    },
    getSomeone(username) {
        if (!username) return console.warn('Typing username or redirect link to user.');
        let url = window.location.origin;
        url += '/' + username;
        API.getUserIdFromUrl(url).then(data => {
            Store.setState(state => {
                try {
                    data = JSON.parse(data.data.split("window._sharedData = ")[1].split(";</script>")[0]);
                    let ProfilePage = data.entry_data.ProfilePage;
                    if (ProfilePage.length > 0) {
                        let info = ProfilePage[0].graphql.user;
                        state.infoWho.username = info.username;
                        state.infoWho.id = info.id;
                    }
                } catch (e) {
                    state.infoWho.message = "Get info account failed";
                    alert("Get info account failed")
                }

                return state;
            });
            this.getListFollow();
        }).catch(ex => {
            alert("UserId incorrect");
            Store.setState(state => {
                state.infoWho.username = '';
                state.infoWho.id = '';
                state.loading_get_list_user = false;
                return state;
            })
        })
    },
    getListFollow(after) {
        let state = Store.getState();
        let pageSize = (state.filter.pageSize > state.filter.limit) ? state.filter.limit : state.filter.pageSize;
        let payload = {
            query_hash: state.query_hash,
            userId: state.infoWho.id,
            first: pageSize,
        };
        if (after) payload.after = after;
        API.getListFollow(payload).then(data => {
            if (data.status === 200) {
                Store.setState(state => {
                    state.dataFollow.listUser = state.dataFollow.listUser.concat(data.data.data.user.edge_followed_by.edges);
                    state.dataFollow.total = data.data.data.user.edge_followed_by.count;
                    return state;
                });

                setTimeout(() => {
                    let state = Store.getState();
                    if (data.data.data.user.edge_followed_by.page_info.has_next_page
                        && state.dataFollow.listUser.length <= state.filter.limit
                        && state.filter.limit > state.filter.pageSize) {
                        this.getListFollow(data.data.data.user.edge_followed_by.page_info.end_cursor);
                    } else {
                        Store.setState(state => {
                            state.loading_get_list_user = false;
                            return state;
                        });
                    }
                }, 1000)
            }

        }).catch(ex => {
            alert('Get list user follow failed ', ex);
            Store.setState(state => {
                state.dataFollow.total = 0;
                state.loading_get_list_user = false;
                return state;
            })

        })
    },
    changeFilter(which, value) {
        Store.setState(state => {
            if (which === 'keywords') {
                state.filter[which] = value;
            } else if (which === 'showFollowers') {
                state.filter[which] = Object.assign({}, state.filter[which], value)
            } else if (which === 'limit') {
                value = parseInt(value);
                if (isNaN(value) || value <= 0) value = 0;
                state.filter[which] = value
            } else if (which === 'showFollowed') {
                state.filter[which] = !state.filter[which]
            }
            return state;
        })
    },
    changeConfigure(which, value) {
        Store.setState(state => {
            if (which === 'is_random') {
                state.configure[which] = !state.configure[which]
            } else {
                value = parseInt(value);
                if (isNaN(value) || value <= 0) value = 0;
                state.configure[which] = value;
            }
            return state;
        })
    },
    randomUserId() {
        let state = Store.getState();
        let _listUser = state.dataFollow.listUser.filter((item, index) => {
            return item.node.followed_by_viewer === false && item.node.requested_by_viewer === false && item.node.is_verified === false
        }).filter((item, index) => {
            return state.filter.showFollowers.min <= index <= state.filter.showFollowers.max
        }).filter(item => {
            return item.node.id !== state.infoAccount.id;
        });
        if (_listUser.length === 0) return null;
        if (_listUser.length === 1) return _listUser[0].node.id;
        let index = Utils.randomIntFromTo(0, _listUser.length - 1);
        console.log('===', index, _listUser);

        if (index <= _listUser.length) return _listUser[index].node.id;
        else this.randomUserId();
    },

    followAll() {
        let userId = this.randomUserId();
        if (!userId) return Store.setState(state => {
            state.loading_follow_list_user = false;
            return state;
        });
        Store.setState(state => {
            state.loading_follow_list_user = true;
            return state;
        });
        API.followAll(userId, Store.getState().infoAccount.token).then(data => {
            if (data.data.status === 'ok') {
                Store.setState(state => {
                    state.dataFollow.listUser.map((item, index) => {
                        if (item.node.id === userId) {
                            item.node.followed_by_viewer = true;
                        }
                        return item;
                    });
                    state.configure.countFollow += 1;
                    return state;
                });

                let configure = Store.getState().configure;
                let min = configure.wait_between_actions;
                if (configure.countFollow % 15 === 0) { // follow 15 times => delay
                    min = configure.wait_minus_after_sort
                }
                let max = min + min * (configure.random_wait / 100);
                let timeOut = Utils.randomIntFromTo(min, max);
                let timer = timeOut/100;
                let interval = setInterval(() => {
                    Store.setState(state => {
                        state.progress += 1;
                        return state;
                    })
                }, timer * 1000);
                setTimeout(() => {
                    Store.setState(state => {
                        state.progress = 0;
                        return state;
                    });
                    clearInterval(interval);
                    this.followAll();
                }, timeOut * 1000)
            }
        }).catch(ex => {
            alert(`Follow userid ${userId} failed`, ex);
            let configure = Store.getState().configure;
            let min = configure.wait_between_actions;
            if (configure.countFollow % 15 === 0) { // follow 15 times => delay
                min = configure.wait_minus_after_sort
            }
            let max = min + min * (configure.random_wait / 100);
            let timeOut = Utils.randomIntFromTo(min, max);
            setTimeout(() => {
                this.followAll();
            }, timeOut * 1000)
        })
    },
    setShowFollowed(is) {
        Store.setState(state => {
            state.filter.showFollowed = is;
            return state;
        })
    }
};

export default Actions;