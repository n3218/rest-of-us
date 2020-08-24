import React, { useContext, useEffect } from "react"
import Page from "./Page"
import StateContext from "../StateContext"
import { useImmer } from "use-immer"
import Loader from "./Loader"
import Axios from "axios"
import { Link } from "react-router-dom"

const Home = () => {
  const appState = useContext(StateContext)
  const [state, setState] = useImmer({
    isLoading: true,
    feed: []
  })

  useEffect(() => {
    const myRequest = Axios.CancelToken.source()
    const fetchData = async () => {
      try {
        const response = await Axios.post("/getHomeFeed", { token: appState.user.token }, { cancelToken: myRequest.token })
        setState(draft => {
          draft.isLoading = false
          draft.feed = response.data
        })
      } catch (err) {
        console.log(err.response.data)
        console.log("...Or request was cancelled")
      }
    }
    fetchData()
    return () => {
      myRequest.cancel("Operation cancelled")
    }
  }, [])

  if (state.isLoading) return <Loader />

  return (
    <Page title="The Latest From Those You Follow">
      {state.feed.length == 0 ? (
        <>
          <h2 className="text-center">
            Hello <strong>{appState.user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
        </>
      ) : (
        <div className="list-group">
          {state.feed.map(post => (
            <Link key={post._id} to={`/post/${post._id}`} href="#" className="list-group-item list-group-item-action pt-4 pb-4">
              <img className="avatar-small mr-3" src={post.author.avatar} />
              <span className="h5">{post.title}</span>
              <span className="text-muted small ml-3">
                {`by ${post.author.username} `} {new Date(post.createdDate).toLocaleString()}{" "}
              </span>
              <div>{post.body.slice(0, 400)}...</div>
              <div className="text-right">Read more &#8618;</div>
            </Link>
          ))}
        </div>
      )}
    </Page>
  )
}

export default Home
