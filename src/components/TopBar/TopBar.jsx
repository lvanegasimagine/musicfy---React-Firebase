import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Icon, Image } from "semantic-ui-react";
import firebase from "../../utils/Firebase";
import { getAuth, signOut } from "firebase/auth";
import UserImage from "../../assets/png/user.png";
import "./TopBar.scss";

function TopBar({ user, history }) {
  const auth = getAuth();

  const goBack = () => {
    history.goBack();
  };

  const logout = () => {
    signOut(auth);
  };

  return (
    <div className="top-bar">
      <div className="top-bar__left">
        <Icon name="angle left" onClick={goBack} />
      </div>
      <div className="top-bar__right">
        <Link to="/settings">
          <Image src={user.photoURL ? user.photoURL: UserImage} />
          {user.displayName}
        </Link>
        <Icon name="power off" onClick={logout} />
      </div>
    </div>
  );
}

export default withRouter(TopBar);
