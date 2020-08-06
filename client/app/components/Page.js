import React, { useEffect } from "react"
import Container from "./Container"

const Page = props => {
  useEffect(() => {
    document.title = `${props.title} | SocialNetApp`
    window.scrollTo(0, 0)
  }, [])

  return (
    <Container title={props.title} wide={props.wide}>
      {props.children}
    </Container>
  )
}

export default Page
