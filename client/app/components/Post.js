import React, { useState, useEffect, useContext } from "react"
import Page from "./Page"
import { useParams, Link, withRouter } from "react-router-dom"
import Axios from "axios"
import Loader from "./Loader"
import ReactMarkdown from "react-markdown"
import NotFound from "./NotFound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

const Post = props => {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()

  useEffect(() => {
    const myRequest = Axios.CancelToken.source()
    const fetchPost = async () => {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: myRequest.token })
        setPost(response.data)
        setIsLoading(false)
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

  if (!isLoading && !post) {
    return <NotFound />
  }

  if (isLoading)
    return (
      <Page title="...">
        <Loader />
      </Page>
    )

  const isOwner = () => {
    if (appState.loggedIn) {
      return appState.user.username === post.author.username
    }
    return false
  }
  const deleteHandler = async () => {
    const areYouSure = window.confirm("Do you really want to delete this post?")
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } })
        if (response.data == "Success") {
          appDispatch({ type: "flashMessage", value: "Your post was successfully deleted." })
          props.history.push(`/profile/${appState.user.username}`)
        }
      } catch (err) {
        console.log(err.response.data)
      }
    }
  }

  return (
    <Page title={post.title}>
      {isOwner() && (
        <div className="d-flex justify-content-end">
          <span className="pt-3">
            <Link to={`/post/${id}/edit`} className="text-dark mr-2" title="Edit">
              <i className="fas fa-edit"></i>
            </Link>{" "}
            <a onClick={deleteHandler} to={`/post/${id}/delete`} className="delete-post-button text-danger" title="Delete">
              <i className="fas fa-trash"></i>
            </a>
          </span>
        </div>
      )}

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`} title={post.author.username}>
          <img className="avatar-small" src={post.author.avatar} alt={post.author.username} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {new Date(post.createdDate).toLocaleString()}
      </p>

      <div className="body-content">
        <ReactMarkdown source={post.body} />
      </div>
    </Page>
  )
}

export default withRouter(Post)
