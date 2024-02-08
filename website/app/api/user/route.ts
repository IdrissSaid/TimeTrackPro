import User from '@/Model/User';
import connectDB from '@/app/lib/connectDB';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function GET() {
  await connectDB();

  try {
    if (!User)
      return NextResponse.json({ message: "Erreur Server" }, { status: 500})
    const users = await User.find().select('firstName role lastName code').populate('pointages', 'date pause');
    return NextResponse.json({ message: "Utilisateurs récupérés !", users });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectDB();

  try {
    const { firstName, lastName, role, pointage } = await req.json();
    const hashedCode = await bcrypt.hash(("" + Math.random()).substring(2, 8), 10)
    if (!User)
      return NextResponse.json({ message: "Erreur Server" }, { status: 500})
    const new_user = new User({
      firstName: firstName,
      lastName: lastName,
      role: role,
      code: hashedCode,
    });

    await new_user.save();
    new_user.validateSync();
    return NextResponse.json({ message: "Utilisateur Créer !" }, { status: 200 });
  } catch (error: any) {
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
