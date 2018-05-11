import Actions from "../flux/actions";
import React from "react";

class ButtonFollow extends React.Component {

    render() {
        let loading = this.props.loading;
        if (loading) return (
            <div className="multi-actions-button stop"
                 onClick={e => {
                     Actions.stopLoadFollowers();
                 }}
            >
            <span>
                <i className="fa fa-spinner fa-pulse fa-fw"/>
                Stop load followers
            </span>
            </div>
        );

        return (
            <div className="multi-actions-button" onClick={this.props.handleLoadFollowers}>
                <span>
                    Load followers
                </span>
            </div>
        )
    }
}
export default ButtonFollow;