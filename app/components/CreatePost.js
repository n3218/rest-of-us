import React, { useState, useContext } from "react"
import Page from "./Page"
import Axios from "axios"
import { Redirect } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

const CreatePost = () => {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  const [title, setTitle] = useState()
  const [body, setBody] = useState()
  const [wasSuccessfull, setWasSuccessfull] = useState(false)

  const submitHandler = async e => {
    e.preventDefault()
    try {
      const response = await Axios.post("/create-post", { title, body, token: appState.user.token })
      setWasSuccessfull(response.data)
      console.log("wasSuccessfull")
      console.log(wasSuccessfull)
    } catch (err) {
      console.log(err.response.data)
    }
  }

  if (wasSuccessfull) {
    console.log("If statement, wasSuccessfull = " + wasSuccessfull)
    appDispatch({ type: "flashMessage", value: "Your post was successfully created!" })
    return <Redirect to={`/post/${wasSuccessfull}`} />
  }

  return (
    <Page title="Create New Post">
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={e => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={e => setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-danger">Save New Post</button>
      </form>
    </Page>
  )
}

export default CreatePost
