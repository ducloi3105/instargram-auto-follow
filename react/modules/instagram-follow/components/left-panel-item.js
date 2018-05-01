import React from "react";
import Store from "../flux/store";
import Helper from '../../common/utils'

let ListFollow = Store.connect(class App extends React.Component {
    render() {
        if (!this.props.listUser.length) return (
            <div className="left-panel-wrapper">
                <pre>No data!</pre>
            </div>
        )

        let listUser = this.props.listUser.filter((item, index) => {
            return (
                Helper.uniDecode(item.node.username.toLowerCase()).indexOf(Helper.uniDecode(this.props.filter.keywords.toLowerCase())) !== -1 ||
                Helper.uniDecode(item.node.full_name.toLowerCase()).indexOf(Helper.uniDecode(this.props.filter.keywords.toLowerCase())) !== -1
            ) && this.props.filter.showFollowers.min <= index && this.props.filter.showFollowers.max >= index
        }).filter(item => {
            if (this.props.filter.showFollowed) {
                return item
            } else {
                return item.node.followed_by_viewer === false && item.node.requested_by_viewer === false && item.node.is_verified === false
            }
        }).filter(item => {
            if (this.props.filter.hideFollowed) {
                return item.node.followed_by_viewer === false
            }
            return item;
        }).filter(item => {
            return item.node.id !== this.props.infoAccount.id;
        });

        return (
            <div className="left-panel-wrapper">
                {
                    listUser.map((item, index) => {
                        let node = item.node;
                        let selected = item.selectedItem ? 'selected-item' : '';
                        return (
                            <div className={"list-item " + selected} key={index + '_' + node.id}>
                                <div className='info-avatar'>
                                    <img src={node.profile_pic_url + '?' + node.id} className="avatar"/>
                                </div>
                                <div className="info-user">
                                    <a href={"https://instagram.com/" + node.username}>{node.username}</a>
                                    <span>{node.full_name}</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}, appState => {
    return {
        infoAccount: appState.infoAccount,
        filter: appState.filter,
        listUser: appState.dataFollow.listUser
    }
});
export default ListFollow;