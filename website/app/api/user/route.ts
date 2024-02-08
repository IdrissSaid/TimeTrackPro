import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { headers } from 'next/headers';
import prisma from '@/db';
import verifyCode from '@/app/lib/verify';

export async function GET() {
  const code = headers()?.get('code')

  if (!code)
    return NextResponse.json({ message: "Access Denied"}, { status: 403 })

  const verify = await verifyCode(code)

  if (verify)
    return verify
  try {
    const users = await prisma.user.findMany({
      select: {
        firstName: true,
        role: true,
        lastName: true,
        code: true,
        pointages: {
          select: {
            date: true, pause: true
          }
        },
      },
    })
    return NextResponse.json({ message: "Utilisateurs récupérés !", users });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { firstName, lastName, role } = await req.json();
    const code = ("" + Math.random()).substring(2, 8)
    // const hashedCode = await bcrypt.hash(code, 10)
    const res = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        role: role,
        code: code,
      }
    })
    if (!res)
      return NextResponse.json({ message: "Internal Server Error", code }, { status: 500 });
    return NextResponse.json({ message: "Utilisateur Créer !", code }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  };
}
