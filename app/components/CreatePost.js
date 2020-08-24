import React, { useContext, useEffect } from "react"
import Page from "./Page"
import { Redirect } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import { useImmerReducer } from "use-immer"
import { CSSTransition } from "react-transition-group"
import Axios from "axios"

const CreatePost = () => {
  const initialState = {
    title: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    body: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    submitCount: 0,
    wasSuccessfull: ""
  }

  const createPostReducer = (draft, action) => {
    switch (action.type) {
      case "titleImmediately":
        draft.title.hasErrors = false
        draft.title.value = action.value
        if (draft.title.value.length > 100) {
          draft.title.hasErrors = true
          draft.title.message = "Title cannot exceed 100 characters."
        }
        return
      case "bodyImmediately":
        draft.body.hasErrors = false
        draft.body.value = action.value
        return
      case "submitPost":
        if (draft.title.value.length < 3) {
          draft.title.hasErrors = true
          draft.title.message = "Title cannot be less then 3 characters."
        }
        if (draft.body.value.length < 3) {
          draft.body.hasErrors = true
          draft.body.message = "Body of your post cannot be less then 3 characters."
        }
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.submitCount++
        }
        return
      case "wasSuccessfull":
        draft.wasSuccessfull = action.value
    }
  }

  const [state, dispatch] = useImmerReducer(createPostReducer, initialState)
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  useEffect(() => {
    if (state.submitCount) {
      const createPostRequest = Axios.CancelToken.source()
      const fetchResult = async () => {
        try {
          const response = await Axios.post("/create-post", { title: state.title.value, body: state.body.value, token: appState.user.token }, { cancelToken: createPostRequest.token })
          dispatch({ type: "wasSuccessfull", value: response.data })
          appDispatch({ type: "flashMessage", value: "Your post was successfully created!" })
        } catch (err) {
          console.log(err)
          appDispatch({ type: "flashMessage", value: err })
        }
      }
      fetchResult()
      return () => createPostRequest.cancel()
    }
  }, [state.submitCount])

  const submitHandler = e => {
    e.preventDefault()
    dispatch({ type: "titleImmediately", value: state.title.value })
    dispatch({ type: "bodyImmediately", value: state.body.value })
    dispatch({ type: "submitPost" })
  }

  if (state.wasSuccessfull) {
    return <Redirect to={`/post/${state.wasSuccessfull}`} />
  }

  return (
    <Page title="Create New Post">
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onChange={e => dispatch({ type: "titleImmediately", value: e.target.value })} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          <CSSTransition in={state.title.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>
          </CSSTransition>
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={e => dispatch({ type: "bodyImmediately", value: e.target.value })} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
          <CSSTransition in={state.body.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
            <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>
          </CSSTransition>
        </div>

        <button className="btn btn-danger">Save New Post</button>
      </form>
    </Page>
  )
}

export default CreatePost
