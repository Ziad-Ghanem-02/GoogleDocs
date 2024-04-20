import { Skeleton } from '../ui/skeleton'
import { cn } from '@/lib/utils'

const TextSkeleton = ({
  className = '',
  withAvatar = false,
}: {
  className?: string
  withAvatar?: boolean
}) => {
  return (
    <div className={cn('flex items-center space-x-4', className)}>
      {withAvatar && <Skeleton className='h-12 w-12 rounded-full' />}
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[250px]' />
        <Skeleton className='h-4 w-[200px]' />
      </div>
    </div>
  )
}

export default TextSkeleton
