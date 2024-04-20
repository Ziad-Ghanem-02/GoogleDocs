import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function addToken(token: string) {
  localStorage.setItem('jwt_token', token)
}

export function removeToken() {
  localStorage.removeItem('jwt_token')
}

export function waitFor(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export function formatDate(date_string: string) {
  const now = new Date()
  const date = new Date(date_string)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  const diffInHours = diffInSeconds / 3600
  const diffInDays = diffInSeconds / 86400

  if (diffInDays >= 7) {
    return `${Math.floor(diffInDays / 7)} week(s) ago`
  } else if (diffInDays >= 1) {
    return `${Math.floor(diffInDays)} day(s) ago`
  } else if (diffInHours >= 1) {
    return (
      'Opened ' +
      date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
    )
  } else {
    return 'Just now'
  }
}
