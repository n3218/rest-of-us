import React from "react"

const FlashMessage = ({ flashMessages, messageColor }) => {
  return (
    <div className="floating-alerts">
      {flashMessages.map((msg, index) => {
        return (
          <div key={index} className={"alert text-center floating-alert shadow-sm alert-" + messageColor}>
            {msg}
          </div>
        )
      })}
    </div>
  )
}

export default FlashMessage
