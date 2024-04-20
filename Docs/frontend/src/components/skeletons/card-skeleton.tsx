import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const CardSkeleton = ({ className = '' }: { className?: string }) => {
  return (
    <>
      <div className={cn('flex flex-col space-y-3', className)}>
        <Skeleton className='h-40 rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-[250px]' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
    </>
  )
}

export default CardSkeleton
