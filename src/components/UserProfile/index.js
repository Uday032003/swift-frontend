import { Component } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { ClipLoader } from "react-spinners";

import "./index.css";
import Header from "../Header";

const statusObj = {
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};

class UserProfile extends Component {
  state = { userData: {}, status: statusObj.loading };

  componentDidMount() {
    this.fetchUserData();
  }

  fetchUserData = async () => {
    try {
      const url = "https://jsonplaceholder.typicode.com/users";
      const options = {
        method: "GET",
      };
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        this.setState({ userData: data[0], status: statusObj.success });
      } else {
        this.setState({ status: statusObj.failure });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  loadingView = () => (
    <div className="loader-container">
      <ClipLoader color="#2c2e50" size={25} speedMultiplier={1.5} />
    </div>
  );

  failureView = () => (
    <div className="failure-container">
      <p>Failed to fetch user data. Please try again later.</p>
    </div>
  );

  successView = () => {
    const { userData } = this.state;
    let { name, id, email, phone, address } = userData;
    if (!name) {
      name = "Guest";
    }
    const splittedUserName = name.split(" ");
    let userProfile = "";
    if (splittedUserName.length > 1) {
      userProfile =
        splittedUserName[0][0].toUpperCase() +
        splittedUserName[1][0].toUpperCase();
    } else {
      userProfile = splittedUserName[0][0].toUpperCase();
    }
    if (email) {
      email = email.toLowerCase();
    }
    return (
      <div className="userprofile-container">
        <div className="userprofile-header">
          <button
            type="button"
            className="userprofile-back-button"
            onClick={() => this.props.history.push("/")}
          >
            <IoIosArrowRoundBack
              className="back-icon"
              style={{ color: "#2c2e50" }}
            />
          </button>
          <p className="userprofile-welcome-text">Welcome, {userData.name}</p>
        </div>
        <div className="userprofile-details">
          <div className="profile-container">
            <span className="profile">{userProfile}</span>
            <div className="name-email-container">
              <p className="namee">{name}</p>
              <p className="emaill">{email}</p>
            </div>
          </div>
          <div className="user-details">
            <div className="detail-item">
              <span className="detail-label">User ID</span>
              <p className="detail-value">{id}</p>
            </div>
            <div className="detail-item">
              <span className="detail-label">Name</span>
              <p className="detail-value">{name}</p>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email ID</span>
              <p className="detail-value">{email}</p>
            </div>
            <div className="detail-item">
              <span className="detail-label">Address</span>
              <p className="detail-value">
                {address?.street.toLowerCase()} {address?.city.toLowerCase()}{" "}
                {address?.suite.toLowerCase()}
                ...
              </p>
            </div>
            <div className="detail-item">
              <span>Phone</span>
              <p className="detail-value">{phone}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderView = () => {
    const { status } = this.state;
    switch (status) {
      case statusObj.loading:
        return this.loadingView();
      case statusObj.failure:
        return this.failureView();
      case statusObj.success:
        return this.successView();
      default:
        return null;
    }
  };

  render() {
    return (
      <div className="userprofile-header-container">
        <Header />
        {this.renderView()}
      </div>
    );
  }
}

export default UserProfile;
