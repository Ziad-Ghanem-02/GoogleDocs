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

export function titleText(text: string) {
  return text.slice(0, 1).toUpperCase() + text.slice(1).toLowerCase()
}

export function formatText(text: string, maxLength: number = 12) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...'
  }
  return text
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
  } else if (diffInSeconds < 60) {
    return 'A few seconds ago'
  } else {
    return 'Just now'
  }
}
