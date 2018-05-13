import Actions from "../flux/actions";
import React from "react";

class ButtonFollow extends React.Component {
    render() {
        let loading = this.props.loading;
        if (loading) return (
            <div className="multi-actions-button stop"
                 onClick={e => {
                     Actions.logged('Stop follow all user');
                     Actions.stopFollowAll()
                 }}
            >
            <span>
                <i className="fa fa-spinner fa-pulse fa-fw"/>
                Stop follow
            </span>
            </div>
        );

        return (
            <div className="multi-actions-button"
                 onClick={e => {
                     if(loading) return;
                     Actions.setShowFollowed(false);
                     Actions.logged('Start follow all user');
                     Actions.followAll()
                 }}
            >
            <span>Follow all</span>
            </div>
        )
    }
}
export default ButtonFollow;