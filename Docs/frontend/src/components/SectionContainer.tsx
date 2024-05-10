import { cn } from '@/lib/utils'
import React, { forwardRef } from 'react'

type SectionContainerProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'wide'
}

const SectionContainer = forwardRef<HTMLDivElement, SectionContainerProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          'my-5',
          variant === 'default' ? 'container' : '',
          className,
        )}
      >
        {children}
      </div>
    )
  },
)

SectionContainer.displayName = 'SectionContainer'

export default SectionContainer
