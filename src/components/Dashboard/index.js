import { Component } from "react";
import { RiExpandUpDownLine } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { MdChevronRight } from "react-icons/md";
import { MdOutlineChevronLeft } from "react-icons/md";
import { ClipLoader } from "react-spinners";

import Header from "../Header";

import "./index.css";

const paginationArray = [
  {
    id: "10pages",
    value: 10,
  },
  {
    id: "50pages",
    value: 50,
  },
  {
    id: "100pages",
    value: 100,
  },
];

const statusObj = {
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};

class Dashboard extends Component {
  state = {
    originalData: [],
    data: [],
    searchedOriginalData: [],
    paginationCount: paginationArray[0].value,
    currentPage: 1,
    sortOrder: "none",
    sortBy: "none",
    searchInput: "",
    status: statusObj.loading,
  };

  componentDidMount() {
    this.fetchData();
    const localData = localStorage.getItem("data");
    if (localData) {
      const parsedData = JSON.parse(localData);
      console.log(parsedData);
      this.setState({
        paginationCount: parsedData.paginationCount,
        currentPage: parsedData.currentPage,
        searchInput: parsedData.searchInput,
        sortBy: parsedData.sortBy,
        sortOrder: parsedData.sortOrder,
      });
    }
  }

  componentDidUpdate() {
    const { paginationCount, currentPage, searchInput, sortBy, sortOrder } =
      this.state;
    localStorage.setItem(
      "data",
      JSON.stringify({
        paginationCount,
        currentPage,
        searchInput,
        sortBy,
        sortOrder,
      })
    );
  }

  fetchData = async () => {
    try {
      const url = "https://jsonplaceholder.typicode.com/comments";
      const options = {
        method: "GET",
      };
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        this.setState({ data, status: statusObj.success });
      } else {
        this.setState({ status: statusObj.failure });
      }
    } catch (error) {
      console.error("Error fetching comments data:", error);
    }
  };

  loadingView = () => (
    <div className="loader-container">
      <ClipLoader color="#2c2e50" size={25} speedMultiplier={1.5} />
    </div>
  );

  failureView = () => (
    <div className="failure-container">
      <p>Failed to load data. Please try again later.</p>{" "}
    </div>
  );

  successView = () => {
    const {
      data,
      paginationCount,
      currentPage,
      searchInput,
      sortBy,
      sortOrder,
    } = this.state;
    let copiedData = [...data];
    const searchedOriginalData = copiedData.filter(
      (i) =>
        i.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        i.email.toLowerCase().includes(searchInput.toLowerCase()) ||
        i.body.toLowerCase().includes(searchInput.toLowerCase())
    );
    let copy = [...searchedOriginalData];
    if (sortBy === "postId") {
      if (sortOrder === "asc") {
        copy.sort((a, b) => a.id - b.id);
      } else if (sortOrder === "desc") {
        copy.sort((a, b) => b.id - a.id);
      } else {
        copy = [...searchedOriginalData];
      }
    } else if (sortBy === "name") {
      if (sortOrder === "asc") {
        copy.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOrder === "desc") {
        copy.sort((a, b) => b.name.localeCompare(a.name));
      } else {
        copy = [...searchedOriginalData];
      }
    } else if (sortBy === "email") {
      if (sortOrder === "asc") {
        copy.sort((a, b) => a.email.localeCompare(b.email));
      } else if (sortOrder === "desc") {
        copy.sort((a, b) => b.email.localeCompare(a.email));
      } else {
        copy = [...searchedOriginalData];
      }
    }
    const requiredData = copy.slice(
      paginationCount * (currentPage - 1),
      paginationCount * currentPage
    );
    return (
      <>
        {requiredData.map((i) => {
          const trimmedName = this.trimName(i.name);
          const trimmedComment = this.trimComment(i.body);
          const updName = trimmedName[0].toUpperCase() + trimmedName.slice(1);
          const updemail = i.email[0].toLowerCase() + i.email.slice(1);
          const updComment =
            trimmedComment[0].toUpperCase() + trimmedComment.slice(1);
          return (
            <li key={i.id} className="comment-item">
              <span className="post-id">{i.id}</span>
              <span className="name">{updName}</span>
              <span className="email">{updemail}</span>
              <span className="comment">{updComment}</span>
            </li>
          );
        })}
      </>
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

  trimName = (name) => {
    if (!name) {
      return "";
    }
    if (name.length > 25) {
      const index = name.lastIndexOf(" ", 25);
      return name.slice(0, index);
    }
    return name;
  };

  trimComment = (comment) => {
    if (!comment) {
      return "";
    }
    if (comment.length > 40) {
      const index = comment.lastIndexOf(" ", 50);
      return comment.slice(0, index).trim() + "...";
    }
    return comment;
  };

  onChangingPageCount = (event) => {
    this.setState({ paginationCount: event.target.value, currentPage: 1 });
  };

  onClickPrev = () => {
    this.setState((i) => ({
      currentPage: i.currentPage - 1,
    }));
  };

  onClickNext = () => {
    this.setState((i) => ({
      currentPage: i.currentPage + 1,
    }));
  };

  onClickedPage = (event) => {
    this.setState({ currentPage: parseInt(event.target.textContent) });
  };

  onClickedSortPostId = () => {
    const { sortBy, sortOrder } = this.state;
    if (sortBy === "postId") {
      if (sortOrder === "asc") {
        this.setState({
          sortOrder: "desc",
        });
      } else if (sortOrder === "desc") {
        this.setState({
          sortOrder: "none",
        });
      } else {
        this.setState({
          sortOrder: "asc",
        });
      }
    } else {
      this.setState({
        sortBy: "postId",
        sortOrder: "asc",
      });
    }
  };

  onClickedSortName = () => {
    const { sortBy, sortOrder } = this.state;
    if (sortBy === "name") {
      if (sortOrder === "asc") {
        this.setState({
          sortOrder: "desc",
        });
      } else if (sortOrder === "desc") {
        this.setState({
          sortOrder: "none",
        });
      } else {
        this.setState({
          sortOrder: "asc",
        });
      }
    } else {
      this.setState({
        sortBy: "name",
        sortOrder: "asc",
      });
    }
  };

  onClickedSortEmail = () => {
    const { sortBy, sortOrder } = this.state;
    if (sortBy === "email") {
      if (sortOrder === "asc") {
        this.setState({
          sortOrder: "desc",
        });
      } else if (sortOrder === "desc") {
        this.setState({
          sortOrder: "none",
        });
      } else {
        this.setState({
          sortOrder: "asc",
        });
      }
    } else {
      this.setState({
        sortBy: "email",
        sortOrder: "asc",
      });
    }
  };

  onChangingSearchInput = (event) => {
    this.setState({
      searchInput: event.target.value,
      currentPage: 1,
    });
  };

  render() {
    const { data, paginationCount, currentPage, searchInput } = this.state;
    let copiedData = [...data];
    const searchedOriginalData = copiedData.filter(
      (i) =>
        i.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        i.email.toLowerCase().includes(searchInput.toLowerCase()) ||
        i.body.toLowerCase().includes(searchInput.toLowerCase())
    );
    return (
      <div className="dashboard-header-container">
        <Header />
        <div className="dashboard-container">
          <div className="sortBtns-input-container">
            <div className="sortBtns-container">
              <button
                type="button"
                className="sortBtn"
                onClick={this.onClickedSortPostId}
              >
                Sort Post ID <RiExpandUpDownLine className="sort-icon" />
              </button>
              <button
                type="button"
                className="sortBtn"
                onClick={this.onClickedSortName}
              >
                Sort Name <RiExpandUpDownLine className="sort-icon" />
              </button>
              <button
                type="button"
                className="sortBtn"
                onClick={this.onClickedSortEmail}
              >
                Sort Email <RiExpandUpDownLine className="sort-icon" />
              </button>
            </div>
            <div className="search-input-container">
              <FiSearch />
              <input
                type="search"
                className="search-input"
                value={searchInput}
                placeholder="Search name, email, comment"
                onChange={this.onChangingSearchInput}
              />
            </div>
          </div>
          <ul className="comments-container">
            <li key="com-head" className="heading-cont">
              <span className="post-id">Post ID</span>
              <span className="name">Name</span>
              <span className="email">Email</span>
              <span className="comment">Comment</span>
            </li>
            {this.renderView()}
          </ul>
          <div className="pagination-container">
            <p className="pagination-text">
              {searchedOriginalData.length === 0
                ? 0
                : paginationCount * (currentPage - 1) + 1}
              -
              {searchedOriginalData.length > paginationCount * currentPage
                ? paginationCount * currentPage
                : searchedOriginalData.length}{" "}
              of {searchedOriginalData.length} items
            </p>
            <div className="pre-next-btn-cont">
              <button
                type="button"
                className="pre-btn"
                onClick={currentPage > 1 ? this.onClickPrev : null}
              >
                <MdOutlineChevronLeft size={20} color="grey" />
              </button>
              <button
                type="button"
                className={`previous-page ${currentPage === 1 ? "hidden" : ""}`}
                onClick={this.onClickedPage}
              >
                {currentPage - 1}
              </button>
              <button type="button" className="current-page">
                {currentPage}
              </button>
              <button
                type="button"
                className={`next-page ${
                  currentPage ===
                    Math.ceil(searchedOriginalData.length / paginationCount) ||
                  searchedOriginalData.length === 0
                    ? "hidden"
                    : ""
                }`}
                onClick={this.onClickedPage}
              >
                {currentPage + 1}
              </button>
              <button
                type="button"
                className="next-btn"
                onClick={
                  currentPage <
                  Math.ceil(searchedOriginalData.length / paginationCount)
                    ? this.onClickNext
                    : null
                }
              >
                <MdChevronRight size={20} color="grey" />
              </button>
            </div>
            <select
              className="pagination-select"
              value={paginationCount}
              onChange={this.onChangingPageCount}
            >
              {paginationArray.map((i) => (
                <option key={i.id} value={i.value}>
                  {i.value} / Page
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
