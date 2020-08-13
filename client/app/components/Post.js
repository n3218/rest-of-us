import React, { useState, useEffect, useContext } from "react"
import Page from "./Page"
import { useParams, Link, withRouter } from "react-router-dom"
import ReactTooltip from "react-tooltip"
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
  }, [id])

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
          <span>
            <Link data-for="edit" data-tip="Edit Post" to={`/post/${id}/edit`} className="text-dark mr-3">
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip place="bottom" id="edit" className="custom-tooltip" />

            <a data-for="delete" data-tip="Delete Post" onClick={deleteHandler} to={`/post/${id}/delete`} className="delete-post-button text-danger">
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip place="bottom" id="delete" className="custom-tooltip" />
          </span>
        </div>
      )}

      <div className="text-muted small mb-4 mt-4">
        <Link data-for="profile" data-tip={`${post.author.username} Profile`} to={`/profile/${post.author.username}`}>
          <img className="avatar-small mr-3" src={post.author.avatar} alt={post.author.username} />
        </Link>
        <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {new Date(post.createdDate).toLocaleString()}
      </div>

      <div className="body-content">
        <ReactMarkdown source={post.body} />
      </div>
    </Page>
  )
}

export default withRouter(Post)
