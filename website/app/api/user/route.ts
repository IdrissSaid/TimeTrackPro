import user from '@/Model/User'
import connectDB from '@/app/lib/connectDB'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectDB()

  try {
    const users = await user?.find().select('-_id firstName role lastName code')
    return NextResponse.json({message: "Utilisateurs récupérés !", users})
  } catch (err) {
    return NextResponse.json({message: err}, {status: 500})
  }
}

export async function POST(req: Request) {
  await connectDB()

  try {
    const { firstName, lastName, role } = await req.json()
    const code = ("" + Math.random()).substring(2, 8)

    if (!user)
      return NextResponse.json({message: "Erreur Serveur"}, {status: 500})
    const new_user = new user({
      firstName:firstName,
      lastName:lastName,
      role:role,
      code:code
    })

    await new_user.save()
    new_user.validateSync()
    return NextResponse.json({message: "Utilisateur Créer !"}, {status: 200})
  } catch (error : any) {
    if (error.name === 'ValidationError') {
      const validationErrors: Record<string, string>  = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return NextResponse.json({ message: "Validation Error", details: validationErrors }, { status: 400 });
    } else {
      console.error(error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  };
}
