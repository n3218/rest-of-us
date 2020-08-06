import React from "react"

const Container = props => {
  return (
    <div className={"container py-md-5 " + (props.wide ? "" : "container--narrow")}>
      <h2>{props.title}</h2>
      {props.children}
    </div>
  )
}

export default Container
