import React, { useContext } from "react"
import { Link } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

const HeaderLoggedIn = () => {
  const dispatch = useContext(DispatchContext)
  const state = useContext(StateContext)
  const logoutHandler = () => {
    dispatch({ type: "logout" })
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
      <Link to={`/profile/${state.user.username}`} className="mr-2">
        <img className="small-header-avatar" src={state.user.avatar} />
      </Link>
    </div>
  )
}

export default HeaderLoggedIn
