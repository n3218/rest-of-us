import React, { useContext } from "react"
import HeaderLoggedOut from "./HeaderLoggedOut"
import HeaderLoggedIn from "./HeaderLoggedIn"
import StateContext from "../StateContext"

const Header = props => {
  const appState = useContext(StateContext)
  const headerContent = appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />
  return (
    <>
      <header className="header-bar bg-info mb-3">
        <div className="container d-flex flex-column flex-md-row align-items-center p-3">
          <h4 className="my-0 mr-md-auto font-weight-normal">
            <a href="/" className="text-white">
              SocialNetApp
            </a>
          </h4>
          {!props.staticEmpty ? headerContent : ""}
        </div>
      </header>
    </>
  )
}

export default Header
