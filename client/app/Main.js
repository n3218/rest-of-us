import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import HomeGuest from "./components/HomeGuest"
import About from "./components/About"
import Terms from "./components/Terms"

const Main = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact>
          <HomeGuest />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/terms">
          <Terms />
        </Route>
      </Switch>

      <Footer />
    </Router>
  )
}

ReactDOM.render(<Main />, document.querySelector("#app"))
if (module.hot) {
  module.hot.accept()
}
