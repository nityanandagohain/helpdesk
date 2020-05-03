import React from "react";

const Tweet = (props) => {
    const { tweet } = props;
    return (
        <div className="card">
            <h4>{tweet.user.name}</h4>
            <p>{tweet.text}</p>
        </div>
    )
}

export default Tweet;