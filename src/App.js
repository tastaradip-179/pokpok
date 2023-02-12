import { Routes, Route } from "react-router-dom";
import Forgetpassword from "./pages/forgetpassword";
import Home from "./pages/home";
import Login from "./pages/login";
import Registration from "./pages/registration";
import Message from "./pages/message";
import { useSelector } from 'react-redux';


function App() {

  let data = useSelector((state) => state.userLoginInfo.userInfo); 

  return (
    <Routes>
      <Route path="/" element={data?<Home />:<Login/>} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgetpassword" element={<Forgetpassword />} />
      <Route path="/messages" element={<Message />} />
    </Routes>
  );
}

export default App;
