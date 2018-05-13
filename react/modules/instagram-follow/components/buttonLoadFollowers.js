import Actions from "../flux/actions";
import React from "react";

class ButtonFollow extends React.Component {

    render() {
        let loading = this.props.loading;
        if (loading) return (
            <div className="multi-actions-button stop"
                 onClick={e => {
                     Actions.logged(this.props.textStop+'.');
                     Actions.stopLoadFollowers();
                 }}
            >
            <span>
                <i className="fa fa-spinner fa-pulse fa-fw"/>
                {this.props.textStop}
            </span>
            </div>
        );

        return (
            <div className="multi-actions-button" onClick={() => {
                Actions.logged(this.props.textStart + '.');
                this.props.handleLoadFollowers(this.props.query_hash)
            }}>
                <span>{this.props.textStart}</span>
            </div>
        )
    }
}

export default ButtonFollow;