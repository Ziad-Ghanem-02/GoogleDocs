import SignUpForm from '@/components/SignUpForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import useSession from '@/hooks/useSession'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
  const session = useSession()
  const navigate = useNavigate()
  if (session.status === 'authenticated') {
    navigate('/')
    return
  }
  return (
    <div className='flex h-screen-no-nav items-center justify-center'>
      <Card className='flex flex-col items-center justify-center gap-2 shadow-md'>
        <CardHeader className='space-y-4'>
          <CardTitle className='text-lg font-bold'>Sign-up</CardTitle>
          <CardDescription>
            Sign-up to CoEdit to start coding with your friends in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent className='w-full'>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUp
