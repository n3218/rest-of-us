import React, { useState, useReducer, useEffect, Suspense } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { CSSTransition } from "react-transition-group"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
Axios.defaults.baseURL = process.env.BACKENDURL || ""

import Header from "./components/Header"
import Footer from "./components/Footer"
import HomeGuest from "./components/HomeGuest"
import Home from "./components/Home"
const About = React.lazy(() => import("./components/About"))
const Terms = React.lazy(() => import("./components/Terms"))
const Post = React.lazy(() => import("./components/Post"))
const Profile = React.lazy(() => import("./components/Profile"))
const EditPost = React.lazy(() => import("./components/EditPost"))
const CreatePost = React.lazy(() => import("./components/CreatePost"))
const Chat = React.lazy(() => import("./components/Chat"))
import FlashMessage from "./components/FlashMessage"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import NotFound from "./components/NotFound"
import Search from "./components/Search"
import Loader from "./components/Loader"

const Main = () => {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("restOfUsToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("restOfUsToken"),
      username: localStorage.getItem("restOfUsUsername"),
      avatar: localStorage.getItem("restOfUsAvatar")
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0
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
      case "openSearch":
        draft.isSearchOpen = true
        return
      case "closeSearch":
        draft.isSearchOpen = false
        return
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen
        return
      case "closeChat":
        draft.isChatOpen = false
        return
      case "incrementUnreadChatCount":
        draft.unreadChatCount++
        return
      case "clearUnreadChatCount":
        draft.unreadChatCount = 0
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

  useEffect(() => {
    if (state.loggedIn) {
      const searchRequest = Axios.CancelToken.source()
      const fetchResults = async () => {
        try {
          const response = await Axios.post("/checkToken", { token: state.user.token }, { cancelToken: searchRequest.token })
          if (!response.data) {
            dispatch({ type: "logout" })
            dispatch({ type: "flashMessage", value: "Your session has expired. Please login again." })
          }
        } catch (err) {
          console.log("There was a problem or request was cancelled")
          console.log(err)
        }
      }
      fetchResults()
      return () => searchRequest.cancel()
    }
  }, [])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router>
          <FlashMessage flashMessages={state.flashMessages} />
          <Header />
          <Suspense fallback={<Loader />}>
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
          </Suspense>
          <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
            <Search />
          </CSSTransition>
          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
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
