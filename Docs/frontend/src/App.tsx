import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignIn from './components/Login/SignIn'
import SignUp from './components/Signup/SignUp'

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/login' element={<SignIn />} />
          <Route path='/' element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
