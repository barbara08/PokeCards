import React from "react";

export default class Nick extends React.Component {
    render() {
        let add_class = "";
        if (this.props.class_custom !== undefined){
            add_class = this.props.class_custom;
        }

        return (
            <div className={add_class + " rival_nick"}>
                <div className="rival_nick_value">{this.props.name}</div>
            </div>
        )
    }
}
