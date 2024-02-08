import pointage from '@/Model/Pointage'
import user from '@/Model/User'
import connectDB from '@/app/lib/connectDB'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectDB()

  try {
    const pointages = await pointage?.find().select('date pause').populate('user', '-_id firstName lastName code role')
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

    let userFounded
    let error

    if (code && (code[0] === "A" || code[0] === "a")) {
      userFounded = await user?.findOne({code: code.slice(1, code.length)})
      if (userFounded && userFounded.role.indexOf("ADMIN") == -1)
        error = {message: "Access Denied", status: 403}
    } else {
      userFounded = await user?.findOne({code: code})
      if (!userFounded)
        error = {message: "User not found", status: 404}
    }
    if (!userFounded || error)
      return NextResponse.json({message: error?.message || "User not found"}, {status: error?.status || 404})

    const new_pointage = new pointage({
      user: userFounded,
      date: Date(),
      pause: pause
    })

    if(userFounded.pointages)
      userFounded.pointages.push(new_pointage.id)
    else
      userFounded.pointages = [new_pointage.id]
    new_pointage.validateSync()
    await new_pointage.save()
    await userFounded.save()
    return NextResponse.json({message: "Opération réussite !"}, {status: 200})
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
