import React, { useContext } from "react"
import HeaderLoggedOut from "./HeaderLoggedOut"
import HeaderLoggedIn from "./HeaderLoggedIn"
import StateContext from "../StateContext"

const Header = () => {
  const state = useContext(StateContext)
  return (
    <>
      <header className="header-bar bg-info mb-3">
        <div className="container d-flex flex-column flex-md-row align-items-center p-3">
          <h4 className="my-0 mr-md-auto font-weight-normal">
            <a href="/" className="text-white">
              SocialNetApp
            </a>
          </h4>
          {state.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
        </div>
      </header>
    </>
  )
}

export default Header
