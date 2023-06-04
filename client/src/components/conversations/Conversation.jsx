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
        console.log("friendIds",friendIds)
        const res = await axios("/users?userId=" + friendIds);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation">
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
        <span className="conversationIconBadge">{conversation.count}</span>
      </div>
      <span className="conversationName">{conversation.name ? conversation.name : user?.username}</span>
    </div>
  );
}
