import React, { useState, useEffect } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import Loader from "./Loader"

const ListOfPersons = ({ who }) => {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [persons, setPersons] = useState([])

  useEffect(() => {
    const myRequest = Axios.CancelToken.source()
    const fetchPersons = async () => {
      try {
        const response = await Axios.get(`/profile/${username}/${who}`, { cancelToken: myRequest.token })
        setPersons(response.data)
        setIsLoading(false)
      } catch (err) {
        console.log(err.response.data)
        console.log("...Or request was cancelled")
      }
    }
    fetchPersons()
    return () => {
      myRequest.cancel("Operation cancelled")
    }
  }, [username, who])

  if (isLoading) return <Loader />

  return (
    <div className="list-group">
      {persons.map((person, index) => (
        <PersonInList key={index} person={person} />
      ))}
    </div>
  )
}

export const PersonInList = ({ person }) => {
  return (
    <Link to={`/profile/${person.username}`} className="list-group-item list-group-item-action">
      <img className="avatar-small mr-3" src={person.avatar} />
      <span className="h5">{person.username}</span>
    </Link>
  )
}

export default ListOfPersons
