import pointage from '@/Model/Pointage'
import connectDB from '@/app/lib/connectDB'
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  if (!params.id) {
    return NextResponse.json({status: 400})
  }
  await connectDB()

  try {
    const pointageFound = await pointage?.findById(params.id).select('date pause').populate('user', '-_id firstName lastName code role')
    if (!pointageFound) {
      return NextResponse.json({messge: "Pointage not found"}, {status: 404})
    }
    return NextResponse.json({messge: "Pointage found", "pointage": pointageFound}, {status: 200})
  } catch (err) {
    return NextResponse.json({message: err}, {status: 500})
  }
}

export async function DELETE(request: Request,{ params }: { params: { id: string } }) {
  if (!params.id) {
      return NextResponse.json({status: 400})
  }
  await connectDB()

  try {
    const res = await pointage?.findByIdAndDelete(params.id)
    if (!res)
      return NextResponse.json({messge: "Pointage not found"}, {status: 404})
    return NextResponse.json({message: "Pointage deleted"})
  } catch (err) {
    return NextResponse.json({message: err}, {status: 500})
  }
}

export async function PUT(request: Request,{ params }: { params: { id: string } }) {
  if (!params.id) {
    return NextResponse.json({status: 400})
  }
  await connectDB()

  try {
    const { date, pause } = await request.json()
    const pointageFound = await pointage?.findById(params.id).select('date pause')
    if (!pointageFound) {
      return NextResponse.json({messge: "Pointage not found"}, {status: 404})
    }
    if (date) pointageFound.date = date
    if (pause) pointageFound.pause = pause
    pointageFound.save()
    return NextResponse.json({message: "Pointage Modified"})
  } catch (err) {
    return NextResponse.json({message: err}, {status: 500})
  }
}