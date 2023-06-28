import React, {useState} from 'react'
import {useNavigate} from "react-router-dom"
import bigInt from "big-integer"
import { prime } from '../assets/js/constants/dh'
import { calculateSharedKey } from '../assets/js/dh/utils/calculate-shared-key'

const Home = ({socket}) => {
    const navigate = useNavigate()
    const [userName, setUserName] = useState("")
    const [key, setKey] = useState("")
    const [algorithm, setAlgorithm] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        const publicKey = bigInt.randBetween(2, prime.minus(1)).toString();
        const { privateKey, sharedKey } = calculateSharedKey(publicKey);
        localStorage.setItem("userName", userName)
        localStorage.setItem("key", key)
        localStorage.setItem("algorithm", algorithm)
        localStorage.setItem("privateKey", privateKey)
        localStorage.setItem("sharedKey", sharedKey)
        localStorage.setItem("publicKey", publicKey)
        socket.emit("newUser", { userName, algorithm, key, socketID: socket.id, publicKey, sharedKey })
        navigate("/chat")
    }
  return (
    <form className='home__container' onSubmit={handleSubmit}>
        <h2 className='home__header'>Sign in to Open Chat</h2>
        <label htmlFor="username">Username</label>
        <input type="text" 
        minLength={6} 
        name="username" 
        id='username'
        className='username__input' 
        value={userName} 
        onChange={e => setUserName(e.target.value)}
        />
        <label htmlFor="key">Key</label>
        <input type="text" 
        minLength={6} 
        name="key" 
        id='key'
        className='key__input' 
        value={key} 
        onChange={e => setKey(e.target.value)}
        />
        <label htmlFor="algorithm">Algorithm</label>
      <select
        name="algorithm"
        id="algorithm"
        className="algorithm__select"
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
      >
        <option value="">Select an algorithm</option>
        <option value="sdes">S-DES</option>
        <option value="rc4">RC4</option>
      </select>
        <button className='home__cta'>SIGN IN</button>
    </form>
  )
}

export default Home