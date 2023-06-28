import React, {useState} from 'react'
// import { encryptSDES } from '../assets/js/s-des'
import { encryptRC4 } from '../assets/js/rc4'
import { encryptDH } from '../assets/js/dh'

const ChatFooter = ({socket}) => {
    const [message, setMessage] = useState("")
    const handleTyping = () => socket.emit("typing",`${localStorage.getItem("userName")} is typing`)

    const handleEncrypt = (message) => {
      console.log('message', JSON.stringify(message))
      const users = localStorage.getItem("usersLogged")
      const usersParsed = JSON.parse(users)
      const otherInstancesUsers = usersParsed.filter(user => user.userName !== message.userName)
      // const textEncrypted = message.algorithm === 'sdes' ? encryptSDES(message) : encryptRC4(message)
      // const textEncrypted = encryptRC4(message.text, message.key)
      // console.log('textEncryptedRC4', textEncrypted)
      const textEncrypted = message.text
      const payloadEncrypted = otherInstancesUsers?.length ? encryptDH(JSON.stringify({ ...message, text: textEncrypted }), otherInstancesUsers[0].sharedKey) : JSON.stringify({ ...message, text: textEncrypted })
      console.log('payloadEncryptedDH', JSON.stringify(payloadEncrypted))
      return payloadEncrypted
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