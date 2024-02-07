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

export async function PUT(request: Request,{ params }: { params: { id: string } }) {
  if (!params.id) {
    return NextResponse.json({status: 400})
  }
  await connectDB()

  try {
    const { firstName, lastName, role } = await request.json()
    const userFound = await user?.findOne({ code: params.id }).select('firstName role lastName code')
    if (!userFound) {
      return NextResponse.json({messge: "User not found"}, {status: 404})
    }
    if (firstName) userFound.firstName = firstName
    if (lastName) userFound.lastName = lastName
    if (role && typeof role === 'string') {
      const index = userFound.role.indexOf(role);
      userFound.role = index === -1
        ? [...userFound.role, role]
        : userFound.role.filter(item => item !== role);
    } else if (role && Array.isArray(role) && role.length > 0) {
      role.forEach((roleItem) => {
        const index = userFound.role.indexOf(roleItem);
        userFound.role = (index === -1)
          ? [...userFound.role, roleItem]
          : userFound.role.filter(item => item !== roleItem);
        });
      }
    if (userFound.role.length == 0)
      userFound.role.push("USER")
    userFound.save()
    return NextResponse.json({message: "User Modified"})
  } catch (err) {
    return NextResponse.json({message: err}, {status: 500})
  }
}