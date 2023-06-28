import React, { useEffect, useState, useRef} from 'react'
import ChatBar from './ChatBar'
import ChatBody from './ChatBody'
import ChatFooter from './ChatFooter'
import { CBC } from '../assets/js/cbc'
import { ECB } from '../assets/js/ecb'

const getAlgorithmInstance = (algorithm, key, iv) => {
  let algorithmInstance;
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

const ChatPage = ({socket}) => { 
  const [messages, setMessages] = useState([])
  const [typingStatus, setTypingStatus] = useState("")
  const lastMessageRef = useRef(null);

  const handleDecrypt = (message) => {
    const algorithmInstance = getAlgorithmInstance(message.algorithm, message.key?.split("").map(Number), message.iv?.split("").map(Number))
    const decryptedMessage = algorithmInstance.decrypt(message.text)
    return { ...message, text: decryptedMessage }
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