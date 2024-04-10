import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const saveToken = (token: string) => {
  // Store token in local storage
  localStorage.setItem('token', token)
}

export const removeToken = () => {
  // Remove token from local storage
  localStorage.removeItem('token')
}
