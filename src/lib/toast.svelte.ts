import { v4 as uuid } from "uuid";

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  body: string;
}


export const toasts: Toast[] = $state([])

export function addToast(type: 'success' | 'error' | 'info', body: string) {
  const id = uuid()
  toasts.push({ id , type, body })
  setTimeout(() => {removeToast(id)}, 5000)
}

export function removeToast(id: string) {
  const index = toasts.findIndex((v)=>(v.id === id))
  if (index > -1) {
    toasts.splice(index, 1)
  }
}