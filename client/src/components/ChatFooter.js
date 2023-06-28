import React, {useState} from 'react'
import { CBC } from '../assets/js/cbc'
import { ECB } from '../assets/js/ecb'

const getAlgorithmInstance = () => {
  let algorithmInstance;
  const key = localStorage.getItem("key")?.split("").map(Number)
  const iv = localStorage.getItem("iv")?.split("").map(Number)
  const algorithm = localStorage.getItem("algorithm")
  switch (algorithm) {
    case "SDES-CBC":
      algorithmInstance = new CBC(key, iv) 
      break;
    case "SDES-ECB":
      algorithmInstance = new ECB(key)
      break;
    case "RC4":
      algorithmInstance = { decrypt: (message) => message, encrypt: (message) => message }
      break;
    default:
      break;
  }

  return algorithmInstance
}

const ChatFooter = ({socket}) => {
  const [message, setMessage] = useState("")

  const algorithmInstance = getAlgorithmInstance()

  const handleTyping = () => socket.emit("typing",`${localStorage.getItem("userName")} is typing`)

  const handleEncrypt = (message) => {
    console.log('handleEncrypt', JSON.stringify(message))

    const encryptedMessage = algorithmInstance.encrypt(message.text)
    console.log(encryptedMessage)
    return { ...message, text: encryptedMessage }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if(message.trim() && localStorage.getItem("userName")) {
      socket.emit("message", 
        handleEncrypt(
          {
            text: message, 
            name: localStorage.getItem("userName"), 
            algorithm: localStorage.getItem("algorithm"),
            key: localStorage.getItem("key"),
            iv: localStorage.getItem("iv"),
            id: `${socket.id}${Math.random()}`,
            socketID: socket.id
          }
        )
      )
    }
    setMessage("")
  }

  return (
    <div className='chat__footer'>
        <form className='form' onSubmit={handleSendMessage}>
          <input 
            type="text" 
            placeholder='Write message' 
            className='message' 
            value={message} 
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleTyping}
            />
            <button className="sendBtn">SEND</button>
        </form>
     </div>
  )
}

export default ChatFooter