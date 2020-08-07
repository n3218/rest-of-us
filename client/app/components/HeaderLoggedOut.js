import React, { useState } from "react"
import Axios from "axios"

const HeaderLoggedOut = ({ setLoggedIn }) => {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  const loginSubmitHandler = async e => {
    e.preventDefault()
    try {
      const response = await Axios.post("http://localhost:8080/login", { username, password })
      if (response.data) {
        setLoggedIn(true)
        localStorage.setItem("restOfUsToken", response.data.token)
        localStorage.setItem("restOfUsUsername", response.data.username)
        localStorage.setItem("restOfUsAvatar", response.data.avatar)

        console.log(response.data)
        console.log(username + " user successfully logged in")
      } else {
        console.log("Incorrect username / password")
      }
    } catch (error) {
      console.log(error.response.data)
    }
  }

  return (
    <form className="mb-0 pt-2 pt-md-0" onSubmit={loginSubmitHandler}>
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input value={username} onChange={e => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input value={password} onChange={e => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-light btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  )
}

export default HeaderLoggedOut
