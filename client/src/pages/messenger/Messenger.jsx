import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
        chatId: data.chatId
      });
      const refreshConversations = async () => {
        try {
          const res = await axios.get("/conversations/" + data.receiverId);
          setConversations(res.data);
        } catch (err) {
          console.log(err);
        }
      };      
      refreshConversations();
    });
  }, []);


  // make your own message on the other side
  useEffect(() => {
    arrivalMessage &&
      currentChat?._id === arrivalMessage.chatId &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id + "/" + user._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat, user._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverIds = currentChat.members.filter(
      (member) => member !== user._id
    );
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverIds,
      chatId: currentChat._id,
      text: newMessage,
    });

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    };
    };

    const handleClickConversation = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.get("/messages/" + currentChat?._id + "/" + user._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
      try {
        const res = await axios.get("/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
      };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const inputProps = async (e) => {
    e.preventDefault();
    const user = {
      userName: "test",
    };
    try {
      await axios.post("/users/users", user);
    } catch (err) {
      console.log(err);
    }

  };

  return (
    <>
      <Topbar />
      
      <div className="homeContainer">
        <Sidebar />
        <div className="messenger">
          <div className="chatMenu">
            <div className="chatMenuWrapper">
              <input placeholder="Search" className="chatMenuInput"  onChange={inputProps} />
              {conversations.map((c) => (
                <div onClick={() => setCurrentChat(c)}>
                  <div onClick={handleClickConversation}>
                    <Conversation conversation={c} currentUser={user} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="chatBox">
            <div className="chatBoxWrapper">
              {currentChat ? (
                <>
                  <div className="chatBoxTop">
                    {messages.map((m) => (
                      <div ref={scrollRef}>
                        <Message message={m} own={m.sender === user._id} />
                      </div>
                    ))}
                  </div>
                  <div className="chatBoxBottom">
                    <textarea
                      className="chatMessageInput"
                      placeholder="write something..."
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                    ></textarea>
                    <button className="chatSubmitButton" onClick={handleSubmit}>
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <span className="noConversationText">
                  Open a conversation to start a chat.
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
