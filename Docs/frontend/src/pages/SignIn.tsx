import SignInForm from '@/components/SignInForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import useSession from '@/hooks/useSession'
import { useNavigate } from 'react-router-dom'

const SignIn = () => {
  const session = useSession()
  const navigate = useNavigate()
  if (session.status === 'authenticated') {
    return navigate('/')
  }
  return (
    <div className='flex h-screen-no-nav items-center justify-center'>
      <Card className='flex flex-col items-center justify-center gap-2 shadow-md'>
        <CardHeader className='space-y-4'>
          <CardTitle className='text-lg font-bold'>Sign-in</CardTitle>
          <CardDescription>
            Sign-in to CoEdit to start coding with your friends in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent className='w-full'>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default SignIn
