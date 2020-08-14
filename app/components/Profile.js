import React, { useEffect, useContext } from "react"
import Page from "./Page"
import { useParams, NavLink, Switch, Route } from "react-router-dom"
import Axios from "axios"
import ListOfPosts from "./ListOfPosts"
import ListOfPersons from "./ListOfPersons"
import StateContext from "../StateContext"
import { useImmer } from "use-immer"

const Profile = () => {
  const { username } = useParams()
  const appState = useContext(StateContext)

  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: { postCount: "", followerCount: "", followingCount: "" }
    }
  })

  useEffect(() => {
    const myRequest = Axios.CancelToken.source()
    const fetchData = async () => {
      try {
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token }, { cancelToken: myRequest.token })
        setState(draft => {
          draft.profileData = response.data
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
  }, [username])

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true
      })
      const myRequest = Axios.CancelToken.source()
      const fetchData = async () => {
        try {
          const response = await Axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: myRequest.token })
          setState(draft => {
            draft.profileData.isFollowing = true
            draft.profileData.counts.followerCount++
            draft.followActionLoading = false
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
    }
  }, [state.startFollowingRequestCount])

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true
      })
      const myRequest = Axios.CancelToken.source()
      const fetchData = async () => {
        try {
          const response = await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: myRequest.token })
          setState(draft => {
            draft.profileData.isFollowing = false
            draft.profileData.counts.followerCount--
            draft.followActionLoading = false
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
    }
  }, [state.stopFollowingRequestCount])

  const { profileData } = state
  const startFollowing = () => {
    setState(draft => {
      draft.startFollowingRequestCount++
    })
  }
  const stopFollowing = () => {
    setState(draft => {
      draft.stopFollowingRequestCount++
    })
  }
  return (
    <Page title="Profile">
      <h2>
        <img className="avatar-profile mr-3" src={profileData.profileAvatar} /> {profileData.profileUsername}
        {appState.loggedIn && !state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
          <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-3">
            Follow <i className="fas fa-user-plus"></i>
          </button>
        )}
        {appState.loggedIn && state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != "..." && (
          <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-3">
            Stop Following <i className="fas fa-user-times"></i>
          </button>
        )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink exact to={`/profile/${state.profileData.profileUsername}`} className="nav-item nav-link">
          Posts: {profileData.counts.postCount}
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/followers`} className="nav-item nav-link">
          Followers: {profileData.counts.followerCount}
        </NavLink>
        <NavLink to={`/profile/${state.profileData.profileUsername}/following`} className="nav-item nav-link">
          Following: {profileData.counts.followingCount}
        </NavLink>
      </div>
      <Switch>
        <Route exact path="/profile/:username">
          <ListOfPosts />
        </Route>
        <Route path="/profile/:username/followers">
          <ListOfPersons who="followers" />
        </Route>
        <Route path="/profile/:username/following">
          <ListOfPersons who="following" />
        </Route>
      </Switch>
    </Page>
  )
}

export default Profile
