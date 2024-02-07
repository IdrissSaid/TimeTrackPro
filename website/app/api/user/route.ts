import user from '@/Model/User'
import connectDB from '@/app/lib/connectDB'
import { NextResponse } from 'next/server'

export async function GET() {

}

export async function POST(req: Request) {
  await connectDB()
  const { firstName, lastName, role } = await req.json()

  const new_user = new user({
    firstName:firstName,
    lastName:lastName,
    role:role,
    code:"Generated code"
  })

  await new_user.save()
  console.log(firstName, lastName, role)
  return NextResponse.json({message: "Utilisateur Créer!"})
}

export async function PUT() {

}

export async function DELETE() {

}
