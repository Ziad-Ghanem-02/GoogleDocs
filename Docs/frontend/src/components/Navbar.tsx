import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import useSession from '@/hooks/useSession'
import { Edit3 } from 'lucide-react'
import { Button } from './ui/button'
import { removeToken } from '@/lib/utils'

const Navbar = () => {
  const session = useSession()
  return (
    <NavigationMenu className='w-ful h-14'>
      <NavigationMenuList>
        <a href={'/'} className='text-xl font-bold'>
          <NavigationMenuItem className='flex items-center justify-center gap-2'>
            <Edit3 size={24} />
            CoEdit
          </NavigationMenuItem>
        </a>
      </NavigationMenuList>
      {session.status === 'authenticated' ? (
        <NavigationMenuList>
          <Button
            variant={'outline'}
            onClick={() => {
              removeToken()
              window.location.reload()
            }}
          >
            Logout
          </Button>
        </NavigationMenuList>
      ) : (
        <NavigationMenuList>
          <a href={'/login'}>
            <Button variant={'outline'}>Login</Button>
          </a>
          <a href={'/signup'}>
            <Button>Sign Up</Button>
          </a>
        </NavigationMenuList>
      )}
    </NavigationMenu>
  )
}

export default Navbar
