import React, { useState, useEffect } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import Loader from "./Loader"

const ListOfPosts = () => {
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
  }, [username])

  if (isLoading) return <Loader />

  return (
    <div className="list-group">
      {posts.map(post => (
        <PostInList key={post._id} post={post} />
      ))}
    </div>
  )
}

export const PostInList = ({ post, by }) => {
  return (
    <Link to={`/post/${post._id}`} className="list-group-item list-group-item-action">
      <img className="avatar-small mr-3" src={post.author.avatar} />
      <span className="h5">{post.title}</span>
      <span className="text-muted small ml-3">
        {by && `by ${post.author.username} `} {new Date(post.createdDate).toLocaleString()}{" "}
      </span>
    </Link>
  )
}

export default ListOfPosts
