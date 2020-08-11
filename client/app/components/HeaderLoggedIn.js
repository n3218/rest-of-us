import React, { useContext } from "react"
import { Link } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

const HeaderLoggedIn = () => {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  const logoutHandler = () => {
    appDispatch({ type: "logout" })
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
      <button onClick={logoutHandler} className="btn btn-sm bg-dark">
        Log Out
      </button>
      <Link to={`/profile/${appState.user.username}`} className="mr-2">
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
    </div>
  )
}

export default HeaderLoggedIn
