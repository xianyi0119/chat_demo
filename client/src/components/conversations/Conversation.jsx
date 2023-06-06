import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendIds = conversation.members.find((m) => m !== currentUser._id);
    const getUser = async () => {
      try {
        const res = await axios("/users?userId=" + friendIds);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (conversation.name === "")
      {getUser();}
    else {};
    // getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation" key={conversation._id} >
      <div className="conversationIconItem">
        <img
            className="conversationImg"
            src={
              user?.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
        {conversation.count ?  <span className="conversationIconBadge">{conversation.count}</span> : <span></span>}    
      </div>
      <span className="conversationName">{conversation.name ? conversation.name : user?.username}</span>
    </div>
  );
}
