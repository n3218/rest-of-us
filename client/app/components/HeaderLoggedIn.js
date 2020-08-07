import React from "react"
import { Link } from "react-router-dom"

const HeaderLoggedIn = ({ setLoggedIn }) => {
  const logoutHandler = () => {
    setLoggedIn(false)
    localStorage.removeItem("restOfUsToken")
    localStorage.removeItem("restOfUsUsername")
    localStorage.removeItem("restOfUsAvatar")
  }
  return (
    <div className="flex-row my-3 my-md-0">
      <a href="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <span className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <Link className="btn btn-sm btn-light mr-2" to="/create-post">
        Create Post
      </Link>
      <button onClick={logoutHandler} className="btn btn-sm btn-light">
        Log Out
      </button>
      <a href="#" className="mr-2">
        <img className="small-header-avatar" src={localStorage.getItem("restOfUsAvatar")} />
      </a>
    </div>
  )
}

export default HeaderLoggedIn
