import Actions from "../flux/actions";
import React from "react";

class ButtonFollow extends React.Component {

    render() {
        let loading = this.props.loading;
        if (loading) return (
            <div className="multi-actions-button stop"
                 onClick={e => {
                     Actions.stopLoadFollowing();
                 }}
            >
            <span>
                <i className="fa fa-spinner fa-pulse fa-fw"/>
                Stop load following
            </span>
            </div>
        );

        return (
            <div className="multi-actions-button" onClick={() => {
                this.props.handleLoadFollowers(this.props.query_hash)
            }}>
                <span>
                    Load following
                </span>
            </div>
        )
    }
}
export default ButtonFollow;