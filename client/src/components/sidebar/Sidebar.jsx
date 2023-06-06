import "./sidebar.css";
import {
  Forum,
  Chat,
  Handshake,
  Contacts,
  ContactEmergency,
} from "@mui/icons-material";
import { Link } from "react-router-dom";


export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <span className="sidebarListTile">Engate</span>
          <li className="sidebarListItem">
            <Forum className="sidebarIcon" />
            <span className="sidebarListItemText">Forum</span>
          </li>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" />
            <Link to={`/messenger`}>
              <span className="sidebarListItemText">Chats</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <Handshake className="sidebarIcon" />
            <span className="sidebarListItemText">Matches</span>
          </li>
        </ul>
        <hr className="sidebarHr" />
        <ul className="sidebarList">
          <span className="sidebarListTile">People</span>
          <li className="sidebarListItem">
            <Contacts className="sidebarIcon" />
            <span className="sidebarListItemText">Members</span>
          </li>
          <li className="sidebarListItem">
            <ContactEmergency className="sidebarIcon" />
            <span className="sidebarListItemText">Contributors</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
