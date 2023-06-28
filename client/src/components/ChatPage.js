import React, { useEffect, useState, useRef} from 'react'
import ChatBar from './ChatBar'
import ChatBody from './ChatBody'
import ChatFooter from './ChatFooter'
import { decryptDH } from '../assets/js/dh'
import { decryptRC4 } from '../assets/js/rc4'
// import { decryptSDES } from '../assets/js/s-des'

const ChatPage = ({socket}) => { 
  const [messages, setMessages] = useState([])
  const [typingStatus, setTypingStatus] = useState("")
  const lastMessageRef = useRef(null);

  const handleDecrypt = (message) => {
    console.log(message)
    const users = localStorage.getItem("usersLogged")
    const usersParsed = JSON.parse(users)
    const otherInstancesUsers = usersParsed.filter(user => user.userName !== message.userName)
    if (!otherInstancesUsers?.length) {
      return JSON.parse(message)
    }
    const currentUserPrivateKey = localStorage.getItem('privateKey')
    const messageFirstDecryption = decryptDH(message, currentUserPrivateKey)
    // const messageSecondDecryption = messageFirstDecryption.algorithm === 'sdes' ? 
    //   decryptSDES(messageFirstDecryption.text, messageFirstDecryption.key) :
    //   decryptRC4(messageFirstDecryption.text, messageFirstDecryption.key)
    // const messageSecondDecryption = decryptRC4(messageFirstDecryption.text, messageFirstDecryption.key)
    const messageSecondDecryption = messageFirstDecryption.text
    return { ...messageSecondDecryption, text: messageSecondDecryption }
  }

  useEffect(()=> {
    socket.on("messageResponse", data => setMessages([...messages, handleDecrypt(data)]))
  }, [socket, messages])

  useEffect(()=> {
    socket.on("typingResponse", data => setTypingStatus(data))
  }, [socket])

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  return (
    <div className="chat">
      <ChatBar socket={socket}/>
      <div className='chat__main'>
        <ChatBody messages={messages} typingStatus={typingStatus} lastMessageRef={lastMessageRef}/>
        <ChatFooter socket={socket}/>
      </div>
    </div>
  )
}

export default ChatPage