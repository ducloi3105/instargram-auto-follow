import React from 'react';
import Store from "../flux/store";

const Progress = Store.connect(class PopupContainer extends React.Component {
    render() {
        let styles = {
            width: `${this.props.progress}%`
        };
        return (
            <div className="progress" style={styles}/>
        )
    }
}, appState => {
    return {
        progress: appState.progress
    }
});

export default Progress