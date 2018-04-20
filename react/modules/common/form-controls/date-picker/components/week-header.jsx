import React, { Component } from 'react';

class WeekHeader extends Component {
    render() {
        return (
            <div className="week-header">
                <span>C N</span>
                <span>T 2</span>
                <span>T 3</span>
                <span>T 4</span>
                <span>T 5</span>
                <span>T 6</span>
                <span>T 7</span>
            </div>
        );
    }
}

export default WeekHeader;
// var WeekHeader = React.createClass({
//     displayName: "WeekHeader",
//     render: function () {
//         return React.createElement("div", {className: "week-header"},
//             React.createElement("span", null, "C N"),
//             React.createElement("span", null, "T 2"),
//             React.createElement("span", null, "T 3"),
//             React.createElement("span", null, "T 4"),
//             React.createElement("span", null, "T 5"),
//             React.createElement("span", null, "T 6"),
//             React.createElement("span", null, "T 7")
//         );
//     }
// });

// module.exports = WeekHeader;