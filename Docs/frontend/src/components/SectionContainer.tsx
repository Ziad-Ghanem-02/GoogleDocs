import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

const SectionContainer = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return <div className={cn('container my-5', className)}>{children}</div>
}

export default SectionContainer
