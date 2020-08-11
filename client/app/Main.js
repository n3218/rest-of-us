import React, { useState, useReducer, useEffect } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Axios from "axios"
Axios.defaults.baseURL = "http://localhost:8080"
import { useImmerReducer } from "use-immer"
import Header from "./components/Header"
import Footer from "./components/Footer"
import HomeGuest from "./components/HomeGuest"
import About from "./components/About"
import Terms from "./components/Terms"
import Home from "./components/Home"
import CreatePost from "./components/CreatePost"
import Post from "./components/Post"
import FlashMessage from "./components/FlashMessage"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import Profile from "./components/Profile"
import EditPost from "./components/EditPost"
import NotFound from "./components/NotFound"

const Main = () => {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("restOfUsToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("restOfUsToken"),
      username: localStorage.getItem("restOfUsUsername"),
      avatar: localStorage.getItem("restOfUsAvatar")
    }
  }
  const mainReducer = (draft, action) => {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        return
      case "logout":
        draft.loggedIn = false
        return
      case "flashMessage":
        draft.flashMessages.push(action.value)
        return
    }
  }
  const [state, dispatch] = useImmerReducer(mainReducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("restOfUsToken", state.user.token)
      localStorage.setItem("restOfUsUsername", state.user.username)
      localStorage.setItem("restOfUsAvatar", state.user.avatar)
    } else {
      localStorage.removeItem("restOfUsToken")
      localStorage.removeItem("restOfUsUsername")
      localStorage.removeItem("restOfUsAvatar")
    }
  }, [state.loggedIn])
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router>
          <FlashMessage flashMessages={state.flashMessages} />
          <Header />
          <Switch>
            <Route path="/" exact>
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            <Route path="/post/:id" exact>
              <Post />
            </Route>
            <Route path="/post/:id/edit">
              <EditPost />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/terms">
              <Terms />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
          <Footer />
        </Router>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

ReactDOM.render(<Main />, document.querySelector("#app"))
if (module.hot) {
  module.hot.accept()
}
