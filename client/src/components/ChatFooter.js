import React, {useState} from 'react'
import { CBC } from '../assets/js/cbc'
import { ECB } from '../assets/js/ecb'
import { RC4 } from '../assets/js/rc4';
import { encryptMessageDH } from '../assets/js/dh';

const getAlgorithmInstance = () => {
  let algorithmInstance;
  const key = localStorage.getItem("key")
  const iv = localStorage.getItem("iv")
  const algorithm = localStorage.getItem("algorithm")
  switch (algorithm) {
    case "SDES-CBC":
      algorithmInstance = new CBC(key?.split("").map(Number), iv?.split("").map(Number)) 
      break;
    case "SDES-ECB":
      algorithmInstance = new ECB(key?.split("").map(Number))
      break;
    case "RC4":
      algorithmInstance = new RC4(key)
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
    const encryptedMessage = algorithmInstance.encrypt(message.text)
    const sharedSecret = localStorage.getItem("sharedSecret")
    const usersLogged = JSON.parse(localStorage.getItem("usersLogged"))
    return usersLogged?.length > 1 ? encryptMessageDH({ ...message, text: encryptedMessage }, sharedSecret?.toString()) : { ...message, text: encryptedMessage };
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