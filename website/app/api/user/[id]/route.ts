import user from '@/Model/User'
import connectDB from '@/app/lib/connectDB'
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  if (!params.id) {
    return NextResponse.json({status: 400})
  }
  await connectDB()

  try {
    const userFound = await user?.findOne({ code: params.id }).select('-_id firstName role lastName code')
    if (!userFound) {
      return NextResponse.json({messge: "User not found"}, {status: 404})
    }
    return NextResponse.json({messge: "User found", "user": userFound}, {status: 200})
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
    const res = await user?.findOneAndDelete({ code: params.id })
    if (!res)
      return NextResponse.json({messge: "User not found"}, {status: 404})
    return NextResponse.json({message: "User deleted"})
  } catch (err) {
    return NextResponse.json({message: err}, {status: 500})
  }
}
