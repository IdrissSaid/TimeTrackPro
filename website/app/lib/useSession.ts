import { cookies } from 'next/headers'

export default function useSession() {
  return {code: cookies().get("code")?.value}
}