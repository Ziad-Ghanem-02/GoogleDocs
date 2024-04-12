import useSession from '@/hooks/useSession'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const session = useSession()
  const navigate = useNavigate()
  console.log('session', session.status)
  if (session.status === 'unauthenticated') {
    navigate('/')
  }
  return <div>Dashboard</div>
}

export default Dashboard
