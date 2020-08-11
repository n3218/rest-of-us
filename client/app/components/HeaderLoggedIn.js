import React, { useContext } from "react"
import { Link } from "react-router-dom"
import ReactTooltip from "react-tooltip"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

const HeaderLoggedIn = () => {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  const logoutHandler = () => {
    appDispatch({ type: "logout" })
  }

  const searchOpenHandler = e => {
    e.preventDefault()
    appDispatch({ type: "openSearch" })
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <a data-for="search" data-tip="Search" href="#" onClick={searchOpenHandler} className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <ReactTooltip place="bottom" id="search" className="custom-tooltip" />
      <span data-for="chat" data-tip="Chat" className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />

      <Link className="btn btn-sm btn-light mr-2" to="/create-post">
        Create Post
      </Link>
      <button onClick={logoutHandler} className="btn btn-sm bg-dark">
        Log Out
      </button>
      <Link data-for="profile" data-tip="Profile" to={`/profile/${appState.user.username}`} className="mr-2">
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
      <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />
    </div>
  )
}

export default HeaderLoggedIn
