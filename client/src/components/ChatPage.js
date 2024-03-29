import React, { useEffect, useState, useRef} from 'react'
import ChatBar from './ChatBar'
import ChatBody from './ChatBody'
import ChatFooter from './ChatFooter'
import { CBC } from '../assets/js/cbc'
import { ECB } from '../assets/js/ecb'
import { RC4 } from '../assets/js/rc4'
import { decryptMessageDH } from '../assets/js/dh'

const getAlgorithmInstance = (algorithm, key, iv) => {
  let algorithmInstance;
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

const ChatPage = ({socket}) => { 
  const [messages, setMessages] = useState([])
  const [typingStatus, setTypingStatus] = useState("")
  const lastMessageRef = useRef(null);

  const handleDecrypt = (message) => {
    const sharedSecret = localStorage.getItem("sharedSecret")
    const usersLogged = JSON.parse(localStorage.getItem("usersLogged"))
    const messageParsed = usersLogged?.length || sharedSecret > 1 ? decryptMessageDH(message, sharedSecret?.toString()) : message
    const algorithmInstance = getAlgorithmInstance(messageParsed.algorithm, messageParsed.key, messageParsed.iv)
    const decryptedMessage = algorithmInstance.decrypt(messageParsed.text)
    return { ...messageParsed, text: decryptedMessage }
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