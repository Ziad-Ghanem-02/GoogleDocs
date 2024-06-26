import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import Navbar from './components/Navbar'
import SignUp from './pages/SignUp'
import { Toaster } from './components/ui/toaster'
import SignIn from './pages/SignIn'
import { AuthProvider } from './components/providers/AuthProvider'
import Dashboard from './pages/Dashboard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TextEditor from './pages/TextEditor'
import SockTest from './pages/SockTest'

const queryClient = new QueryClient()

function App() {
  return (
    <>
      <div className='App min-h-screen'>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Navbar />
            <Router>
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path='/login' element={<SignIn />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/doc/:id' element={<TextEditor />} />
                <Route path='/doc/TestSocket' element={<SockTest />} />
              </Routes>
            </Router>
            <Toaster />
          </AuthProvider>
        </QueryClientProvider>
      </div>
    </>
  )
}

export default App
