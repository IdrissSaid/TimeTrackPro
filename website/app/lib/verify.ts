import { NextResponse } from "next/server"
import prisma from '@/db';

export default async function verifyCode(code: string | null) {
  if (!code)
    return NextResponse.json({ message: "Access Denied"}, { status: 403 })

  const userConnected = await prisma.user.findUnique({
    where: { code: code },
    select: {
      code: true,
      role: true
    }
  })

  if (code !== userConnected?.code || !userConnected || userConnected.role.indexOf('ADMIN') == -1)
    return NextResponse.json({ message: "Access Denied"}, { status: 403 })
  return undefined
}