"use server"
import { cookies } from 'next/headers'

export default async function saveIdentifiant(code: string | undefined) {
  if (code) {
    cookies().set("code", code)
  } else {
    cookies().delete("code")
  }
}