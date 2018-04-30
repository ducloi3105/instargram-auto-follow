import React from "react";
import Store from "../flux/store";


let ListFollow = Store.connect(class App extends React.Component {
    render() {
        if(!this.props.listUser.length) return(
            <div className="left-panel-wrapper">
                <pre>No data!</pre>
            </div>
            )
        return (
            <div className="left-panel-wrapper">
                {
                    this.props.listUser.map((item, index) => {
                        let node = item.node;
                        return (
                            <div className="list-item" key={node.id}>
                                <img src={node.profile_pic_url +'?'+node.id} className="avatar"/>
                                <div className="info-user">
                                    <a href={"https://instagram.com/"+node.username}>{node.username}</a>
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
        listUser: appState.dataFollow.listUser
    }
});
export default ListFollow;