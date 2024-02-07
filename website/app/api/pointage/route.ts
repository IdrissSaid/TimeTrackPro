import pointage from '@/Model/Pointage'
import user from '@/Model/User'
import connectDB from '@/app/lib/connectDB'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectDB()

  try {
    const pointages = await pointage?.find().select('-_id date pause').populate('user', '-_id firstName lastName code role')
    return NextResponse.json({message: "Pointages récupérés !", pointages})
  } catch (err) {
    return NextResponse.json({message: err}, {status: 500})
  }
}

export async function POST(req: Request) {
  await connectDB()

  try {
    const { code, pause } = await req.json()

    if (!pointage)
      return NextResponse.json({message: "Erreur Serveur"}, {status: 500})

    const userFounded = await user?.findOne({code: code})

    if (!userFounded)
      return NextResponse.json({messge: "User not found"}, {status: 404})

    const new_pointage = new pointage({
      user: userFounded,
      date: Date(),
      pause: pause
    })

    await new_pointage.save()
    new_pointage.validateSync()
    return NextResponse.json({message: "Pointage Créer !"}, {status: 200})
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
