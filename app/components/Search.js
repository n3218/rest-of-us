import React, { useContext, useEffect } from "react"
import DispatchContext from "../DispatchContext"
import { useImmer } from "use-immer"
import Axios from "axios"
import { PostInList } from "./ListOfPosts"

const Search = () => {
  const appDispatch = useContext(DispatchContext)

  const [state, setState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0
  })

  useEffect(() => {
    document.addEventListener("keyup", escKeyPressHandler)
    return () => document.removeEventListener("keyup", escKeyPressHandler)
  }, [])

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState(draft => {
        draft.show = "loading"
      })
      const delay = setTimeout(() => {
        setState(draft => {
          draft.requestCount++
        })
      }, 700)
      return () => clearTimeout(delay)
    } else {
      setState(draft => {
        draft.show = "neither"
      })
    }
  }, [state.searchTerm])

  useEffect(() => {
    if (state.requestCount) {
      const searchRequest = Axios.CancelToken.source()
      const fetchResults = async () => {
        try {
          const response = await Axios.post(`/search`, { searchTerm: state.searchTerm }, { cancelToken: searchRequest.token })
          setState(draft => {
            draft.results = response.data
            draft.show = "results"
          })
        } catch (err) {
          console.log("There was a problem or request was cancelled")
          console.log(err)
        }
      }
      fetchResults()
      return () => searchRequest.cancel()
    }
  }, [state.requestCount])

  const escKeyPressHandler = e => {
    if (e.keyCode == 27) {
      appDispatch({ type: "closeSearch" })
    }
  }

  const closeSearchHandler = e => {
    e.preventDefault()
    appDispatch({ type: "closeSearch" })
  }

  const searchHandler = e => {
    const val = e.target.value
    setState(draft => {
      draft.searchTerm = val
    })
  }

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input onChange={searchHandler} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
          <span className="close-live-search" onClick={closeSearchHandler}>
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className={"circle-loader " + (state.show == "loading" ? "circle-loader--visible" : "")}></div>
          <div className={"live-search-results" + (state.show == "results" ? "live-search-results--visible" : "")}>
            {Boolean(state.results.length) ? (
              <div className="list-group shadow-sm" onClick={() => appDispatch({ type: "closeSearch" })}>
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.results.length} {state.results.length === 1 ? "item" : "items"} found)
                </div>
                {state.results.map(post => (
                  <PostInList key={post._id} post={post} by={true} />
                ))}
              </div>
            ) : (
              <p className="alert alert-danger text-center shadow-sm">Sorry, we could not find any results for this search.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
