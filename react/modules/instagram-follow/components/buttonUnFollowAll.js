import Actions from "../flux/actions";
import React from "react";

class ButtonUnFollow extends React.Component {
    render() {
        let loading = this.props.loading;
        if (loading) return (
            <div className="multi-actions-button stop"
                 onClick={e => {
                     Actions.logged('Stop unfollow all user.');
                     Actions.stopUnFollowAll()
                 }}
            >
            <span>
                <i className="fa fa-spinner fa-pulse fa-fw"/>
                Stop unfollow
            </span>
            </div>
        );

        return (
            <div className="multi-actions-button"
                 onClick={e => {
                     if (loading) return;
                     Actions.setShowFollowed(false);
                     Actions.logged('Start unfollow all user.');
                     Actions.unfollowAll()
                 }}
            >
                <span>UnFollow all</span>
            </div>
        )
    }
}

export default ButtonUnFollow;