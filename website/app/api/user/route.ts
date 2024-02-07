import user from '@/Model/User'
import connectDB from '@/app/lib/connectDB'
import { assert } from 'console'
import { NextResponse } from 'next/server'

export async function GET() {

}

export async function POST(req: Request) {
  await connectDB()

  try {
    const { firstName, lastName, role } = await req.json()

    const new_user = new user({
      firstName:firstName,
      lastName:lastName,
      role:role,
      code:"Generated code"
    })

    await new_user.save()
    console.log(firstName, lastName, role)
    new_user.validateSync()
    return NextResponse.json({message: "Utilisateur Créer!"}, {status: 200})
  } catch (error : any) {
    if (error.name === 'ValidationError') {
      const validationErrors: Record<string, string>  = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return NextResponse.json({ error: "Validation Error", details: validationErrors }, { status: 400 });
    } else {
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
}

export async function PUT() {

}

export async function DELETE() {

}
