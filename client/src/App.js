import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./components/Home"
import ChatPage from "./components/ChatPage";
import socketIO from "socket.io-client"
import { calculateSharedSecret } from "./assets/js/dh";

const prime = 23; // Número primo compartilhado entre os usuários
const base = 5; // Base compartilhada entre os usuários

const socket = socketIO.connect("http://localhost:4000")
socket.on('connect', () => {
  // Gerando uma chave privada aleatória para o usuário
  const privateKey = Math.floor(Math.random() * 10) + 1;

  socket.emit('primeAndBase', { prime, base });
  socket.on('publicKey', (data) => {
    const sharedSecret = calculateSharedSecret(privateKey, data, prime);
    localStorage.setItem("sharedSecret", sharedSecret)
  });
});

function App() {
  return (
    <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<Home socket={socket}/>}></Route>
            <Route path="/chat" element={<ChatPage socket={socket}/>}></Route>
          </Routes>
    </div>
    </BrowserRouter>
    
  );
}

export default App;
