import React, { useState, useContext } from "react"
import Axios from "axios"
import DispatchContext from "../DispatchContext"

const HeaderLoggedOut = () => {
  const appDispatch = useContext(DispatchContext)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const loginSubmitHandler = async e => {
    e.preventDefault()
    if (username.trim() && password.trim()) {
      try {
        const response = await Axios.post("/login", { username, password })
        if (response.data) {
          appDispatch({ type: "login", data: response.data })
          appDispatch({ type: "messageColor", value: "success" })
          appDispatch({ type: "flashMessage", value: "You have successfully logged in." })
          console.log(username + " user successfully logged in")
        } else {
          appDispatch({ type: "messageColor", value: "danger" })
          appDispatch({ type: "flashMessage", value: "Invalid username / password." })
        }
      } catch (error) {
        console.log(error.response.data)
      }
    } else {
      appDispatch({ type: "messageColor", value: "danger" })
      appDispatch({ type: "flashMessage", value: "Username or password can not be empty." })
    }
  }

  return (
    <form className="mb-0 pt-2 pt-md-0" onSubmit={loginSubmitHandler}>
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setUsername(e.target.value)} name="username" className={(!username.trim() && "is-invalid ") + "form-control form-control-sm input-dark"} type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setPassword(e.target.value)} name="password" className={(!password.trim() && "is-invalid ") + "form-control form-control-sm input-dark"} type="password" placeholder="Password" />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-danger btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  )
}

export default HeaderLoggedOut
