import React from "react";
import Store from '../flux/store';
import 'react-input-range/lib/css/index.css';

const Terminal = Store.connect(class extends React.Component {
    render() {
        let infoAccount = this.props.infoAccount;
        return (
            <div className="ter-back">
                {
                    this.props.logged.map((item, index) => {
                        let username = infoAccount.username ? infoAccount.username : 'Logged';
                        return (
                            <p key={index} className="ter-log"><b>{username}</b>:~$ {item}</p>
                        )

                    })
                }
            </div>
        )
    }
}, appState => {
    return {
        logged: appState.logged,
        infoAccount: appState.infoAccount
    }
});
export default Terminal;