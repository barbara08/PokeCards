export default function Point({value, class_custom}) {
    let add_class = "";
    if (class_custom !== undefined){
        add_class = class_custom;
    }

    return (
        <div className={add_class + " rival_marker"}>
            <p className="rival_marker_point">Points</p>
            <p className="rival_marker_point_value">{value}</p>
        </div>
    )
}
