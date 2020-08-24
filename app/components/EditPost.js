import React, { useEffect, useContext } from "react"
import { useImmerReducer } from "use-immer"
import { useParams, Link, withRouter } from "react-router-dom"
import Axios from "axios"
import Page from "./Page"
import Loader from "./Loader"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import NotFound from "./NotFound"

const EditPost = props => {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const initialState = {
    title: {
      value: "",
      hasErrors: false,
      message: ""
    },
    body: {
      value: "",
      hasErrors: false,
      message: ""
    },
    isFetching: true,
    isSeving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: null
  }

  const editPostReducer = (draft, action) => {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.isFetching = false
        return
      case "titleChange":
        draft.title.hasErrors = false
        draft.title.value = action.value
        return
      case "bodyChange":
        draft.body.hasErrors = false
        draft.body.value = action.value
        return
      case "submitUpdates":
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++
        }
        return
      case "isSaving":
        draft.isSaving = true
        return
      case "saveRequestStarted":
        draft.isSaving = true
        return
      case "saveRequestFinished":
        draft.isSaving = false
        return
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasErrors = true
          draft.title.message = "Title should not be empty"
        }
        return
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasErrors = true
          draft.body.message = "Body of your post should not be empty"
        }
        return
      case "notFound":
        draft.isFetching = false
        draft.notFound = true
        return
    }
  }

  const [state, dispatch] = useImmerReducer(editPostReducer, initialState)

  useEffect(() => {
    const myRequest = Axios.CancelToken.source()
    const fetchPost = async () => {
      try {
        const response = await Axios.get(`/post/${state.id}`, { cancelToken: myRequest.token })

        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data })
          if (appState.user.username != response.data.author.username) {
            appDispatch({ type: "messageColor", value: "warning" })
            appDispatch({ type: "flashMessage", value: "You do not have permission to edit this post." })
            //redirect to homepage
            props.history.push("/")
          }
        } else {
          dispatch({ type: "notFound" })
        }
      } catch (err) {
        console.log(err.response.data)
        console.log("...Or request was cancelled")
      }
    }
    fetchPost()
    return () => {
      myRequest.cancel("Operation cancelled")
    }
  }, [])

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" })
      const myRequest = Axios.CancelToken.source()
      const fetchPost = async () => {
        try {
          const response = await Axios.post(`/post/${state.id}/edit`, { title: state.title.value, body: state.body.value, token: appState.user.token }, { cancelToken: myRequest.token })
          dispatch({ type: "saveRequestFinished" })
          appDispatch({ type: "flashMessage", value: "Your post was successfully updated!" })
          //redirect to postPage
          props.history.push(`/post/${state.id}`)
        } catch (err) {
          console.log(err.response.data)
          console.log("...Or request was cancelled")
        }
      }
      fetchPost()
      return () => {
        myRequest.cancel("Operation cancelled")
      }
    }
  }, [state.sendCount])

  const submitHandler = e => {
    e.preventDefault()
    dispatch({ type: "titleRules", value: state.title.value })
    dispatch({ type: "bodyRules", value: state.body.value })
    dispatch({ type: "submitUpdates" })
  }

  if (state.isFetching)
    return (
      <Page title="...">
        <Loader />
      </Page>
    )
  if (state.notFound) return <NotFound />

  return (
    <Page title="Edit Post">
      <Link className="small " to={`/post/${state.id}`}>
        &laquo; Back to post
      </Link>
      <form className="mt-2" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input value={state.title.value} onBlur={e => dispatch({ type: "titleRules", value: e.target.value })} onChange={e => dispatch({ type: "titleChange", value: e.target.value })} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          {state.title.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea value={state.body.value} onBlur={e => dispatch({ type: "bodyRules", value: e.target.value })} onChange={e => dispatch({ type: "bodyChange", value: e.target.value })} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" />
          {state.body.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>

        <button className="btn btn-danger" disabled={state.isSaving}>
          {state.isSaving ? "Saving..." : "Save Updates"}
        </button>
      </form>
    </Page>
  )
}

export default withRouter(EditPost)
