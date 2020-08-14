import React from "react"
import Page from "./Page"
import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <Page>
      <Link to="/">
        <img src="https://static.dribbble.com/users/1078347/screenshots/2768915/dribbbleshot_2x.png" />
      </Link>
    </Page>
  )
}

export default NotFound
