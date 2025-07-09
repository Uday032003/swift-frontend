import { withRouter } from "react-router-dom";

import "./index.css";
import UserContext from "../../context/UserContext";

const Header = (props) => (
  <UserContext.Consumer>
    {(value) => {
      let { user } = value;
      const { history } = props;
      if (!user) {
        user = "Guest";
      }
      const splittedUserName = user.split(" ");
      let userProfile = "";
      if (splittedUserName.length > 1) {
        userProfile =
          splittedUserName[0][0].toUpperCase() +
          splittedUserName[1][0].toUpperCase();
      } else {
        userProfile = splittedUserName[0][0].toUpperCase();
      }
      const onClickedProfile = () => {
        history.push("/user");
      };
      return (
        <div className="header-container">
          <img
            src="https://res.cloudinary.com/dnxaaxcjv/image/upload/v1751955929/imageedit_2_45529958589_nb0oqi.png"
            alt="company logo"
            className="logo"
            onClick={() => history.push("/")}
          />
          <div className="user-profile-container" onClick={onClickedProfile}>
            <span className="user-profile">{userProfile}</span>
            <p className="user-name">{user}</p>
          </div>
        </div>
      );
    }}
  </UserContext.Consumer>
);

export default withRouter(Header);
