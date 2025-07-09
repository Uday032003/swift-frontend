import { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import UserProfile from "./components/UserProfile";
import UserContext from "./context/UserContext";

class App extends Component {
  state = { user: "" };

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
        this.setState({ user: data[0].name });
      } else {
        this.setState({ user: "Guest" });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  render() {
    const { user } = this.state;
    console.log(user);
    return (
      <UserContext.Provider
        value={{
          user,
        }}
      >
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/user" component={UserProfile} />
        </Switch>
      </UserContext.Provider>
    );
  }
}

export default App;
