import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Auth from "./Components/Auth";
import Resume from "./Components/Resume";
import Body from "./Components/Body";
import Profiles from "./Components/Profiles";
import ResumeState from "./context/Resume/ResumeState.js";


import Alert from "./Components/Alert"
// import Template from "./Components/Template"
import Footer from "./Components/Footer"
// import Profiles from "./Components/Profiles"
import { useState } from "react"
function App() {
  const [alert, setalert] = useState(null)
  const showAlert = (message, type) => {
    setalert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setalert(null)
    }, 2000);

  }
  return (
    <ResumeState>
      <Router>
        <div className="overflow-x-hidden overflow-hidden">
          <Navbar></Navbar>
          <Alert alert={alert}></Alert>
          <Routes>
            <Route path='/' element={<Home showAlert={showAlert} />} />
            <Route path='/auth/:user' element={<Auth showAlert={showAlert} />} />
            <Route path='/form/:resumeId' element={<Body />} />
            <Route path='/resume/:resumeId' element={<Resume showAlert={showAlert} />} />
          <Route path='/profiles' element={<Profiles showAlert={showAlert} />} />
          </Routes>
          <Footer></Footer>
        </div>
      </Router>
    </ResumeState>
  );
}

export default App;
