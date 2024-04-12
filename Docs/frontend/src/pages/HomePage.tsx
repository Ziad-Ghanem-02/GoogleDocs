import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import useSession from '@/hooks/useSession'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  // If user is not authenticated, display the home page with login and signup options
  // If user is authenticated, redirect to the dashboard

  const session = useSession()
  const navigate = useNavigate()

  if (session.status === 'authenticated') {
    navigate('/dashboard')
  }

  return (
    <>
      <div className='flex h-screen-no-nav items-center justify-center'>
        <Card className='flex flex-col items-center justify-center gap-2 text-center shadow-md'>
          <CardHeader className='space-y-4'>
            <CardTitle className='text-5xl font-bold'>CoEdit</CardTitle>
            <CardDescription className='text-lg'>
              CoEdit is a collaborative code editor that allows you to code with
              your friends in real-time.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex items-center gap-4'>
            <Button onClick={() => navigate('/login')} variant={'outline'}>
              Login
            </Button>
            <Button onClick={() => navigate('/signup')} className=''>
              Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default HomePage
