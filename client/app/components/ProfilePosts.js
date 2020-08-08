import React, { useState, useEffect } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import Loader from "./Loader"

const ProfilePosts = () => {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const myRequest = Axios.CancelToken.source()
    const fetchPosts = async () => {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: myRequest.token })
        setPosts(response.data)
        setIsLoading(false)
      } catch (err) {
        console.log(err.response.data)
        console.log("...Or request was cancelled")
      }
    }
    fetchPosts()
    return () => {
      myRequest.cancel("Operation cancelled")
    }
  }, [])

  if (isLoading) return <Loader />

  return (
    <div className="list-group">
      {posts.map(post => (
        <Link to={`/post/${post._id}`} key={post._id} href="#" className="list-group-item list-group-item-action">
          <img className="avatar-small" src={post.author.avatar} />
          <strong>{post.title}</strong> <span className="text-muted small">on {new Date(post.createdDate).toLocaleString()} </span>
        </Link>
      ))}
    </div>
  )
}

export default ProfilePosts
