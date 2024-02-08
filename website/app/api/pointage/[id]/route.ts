import { NextResponse } from "next/server";
import prisma from "@/db";
import { headers } from "next/headers";
import verifyCode from "@/app/lib/verify";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  if (!params.id) {
    return NextResponse.json({status: 400})
  }

  try {
    const pointageFound = await prisma.pointage.findUnique({
      where: {
        id: params.id
      },
      select: {
        date: true,
        pause: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            code: true,
            role: true
          }
        }
      },
    });

    if (!pointageFound) {
      return NextResponse.json({messge: "Pointage not found"}, {status: 404})
    }
    return NextResponse.json({messge: "Pointage found", "pointage": pointageFound}, {status: 200})
  } catch (err) {
    console.error(err)
    return NextResponse.json({message: err}, {status: 500})
  }
}

export async function DELETE(request: Request,{ params }: { params: { id: string } }) {
  const code = headers()?.get('code')

  const verify = await verifyCode(code)

  if (verify)
    return verify
  if (!params.id) {
      return NextResponse.json({status: 400})
  }

  try {
    const res = await prisma.pointage?.delete({
      where: {
        id: params.id
      },
    })
    if (!res)
      return NextResponse.json({messge: "Pointage not found"}, {status: 404})
    return NextResponse.json({message: "Pointage deleted"})
  } catch (err) {
    return NextResponse.json({message: err}, {status: 500})
  }
}

export async function PUT(request: Request,{ params }: { params: { id: string } }) {
  const code = headers()?.get('code')

  const verify = await verifyCode(code)

  if (verify)
    return verify
  if (!params.id) {
    return NextResponse.json({status: 400})
  }

  try {
    const { date, pause } = await request.json()
    const res = await prisma.pointage.update({
      where: {id: params.id},
      data: {
        date: date,
        pause: pause,
      }
    })
    if (!res)
      return NextResponse.json({messge: "Pointage not found"}, {status: 404})

    return NextResponse.json({message: "Pointage Modified"})
  } catch (err) {
    return NextResponse.json({message: err}, {status: 500})
  }
}