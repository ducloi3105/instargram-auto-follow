import Store from "../flux/store";
import Action from "../flux/actions"
import React from "react";

let ItemFollow = Store.connect(class App extends React.Component {
    render() {
        return (
            <li className="list-item">
                <div className="item-container">
                    <div className="item-wrapper">
                        <div className="item-content">
                            <div className="follow-avatar">
                                <img src="https://instagram.fhan5-7.fna.fbcdn.net/vp/2a2198150ea58759f4bec26c7ff72dd7/5B99881F/t51.2885-19/s150x150/30829937_2025200807509083_1611304827030077440_n.jpg" alt=""/>
                            </div>
                            <div className="follow-info">
                                <div className="follow-account">nguyen duc loi</div>
                                <div className="follow-fullname">asdasdasd</div>
                            </div>
                            <div className="follow-button">
                                        <span>
                                            <button>Follow</button>
                                        </span>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        )
    }
}, appState => {
    return {}
});

export default ItemFollow;