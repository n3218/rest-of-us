import React, { useState, useEffect } from "react"
import Page from "./Page"
import { useParams, Link } from "react-router-dom"
import Axios from "axios"
import Loader from "./Loader"

const Post = () => {
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

  if (isLoading)
    return (
      <Page title="...">
        <Loader />
      </Page>
    )

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-end">
        <span className="pt-2">
          <a href="#" className="text-dark mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </a>
          <a className="delete-post-button text-danger" title="Delete">
            <i className="fas fa-trash"></i>
          </a>
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-small" src={post.author.avatar} alt={post.author.username} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {new Date(post.createdDate).toLocaleString()}
      </p>

      <div className="body-content">
        {post.body}
        <p>
          Lorem ipsum dolor sit <strong>example</strong> post adipisicing elit. Iure ea at esse, tempore qui possimus soluta impedit natus voluptate, sapiente saepe modi est pariatur. Aut voluptatibus aspernatur fugiat asperiores at.
        </p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae quod asperiores corrupti omnis qui, placeat neque modi, dignissimos, ab exercitationem eligendi culpa explicabo nulla tempora rem? Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure ea at esse, tempore qui possimus soluta impedit natus voluptate, sapiente saepe modi est pariatur. Aut voluptatibus aspernatur fugiat asperiores at.</p>
      </div>
    </Page>
  )
}

export default Post
