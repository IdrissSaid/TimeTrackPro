import { NextResponse } from "next/server";
import prisma from "@/db";
import { headers } from "next/headers";
import verifyCode from "@/app/lib/verify";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const code = headers()?.get('code')

  if (!params.id) {
    return NextResponse.json({message: "User Not Found"}, {status: 404})
  }

  try {
    const userFound = await prisma.user?.findUnique({
      where: {
        code: params.id
      },
      select: {
        firstName: true,
        role: true,
        lastName: true,
        code: true,
        pointages: true
      }
    })
    if (!userFound) {
      return NextResponse.json({messge: "User not found"}, {status: 404})
    }
    return NextResponse.json({messge: "User found", "user": userFound}, {status: 200})
  } catch (err) {
    return NextResponse.json({message: err}, {status: 500})
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const code = headers()?.get('code');

  if (!code)
    return NextResponse.json({ message: "Access Denied" }, { status: 403 });

  const verify = await verifyCode(code);

  if (verify)
    return verify;

  if (!params.id) {
    return NextResponse.json({ status: 400 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        code: params.id,
      },
      include: {
        pointages: true,
      },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    await prisma.pointage.deleteMany({
      where: {
        userId: user.id,
      },
    });
    const deletedUser = await prisma.user.delete({
      where: {
        code: params.id,
      },
    });
    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User and associated Pointages deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}


export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const code = headers()?.get('code')

  const verify = await verifyCode(code)

  if (verify)
    return verify
  if (!params.id) {
    return NextResponse.json({ status: 400 });
  }

  try {
    const { firstName, lastName, role, pointage } = await request.json();
    const userFound = await prisma.user?.findUnique({
      where: {
        code: params.id,
      },
      select: {
        id: true,
        firstName: true,
        role: true,
        lastName: true,
        code: true,
        pointages: true
      },
    });

    if (!userFound) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    console.log(firstName, lastName, role);
    const updatedUser = await prisma.user.update({
      where: { id: userFound.id },
      data: {
        firstName: firstName || userFound.firstName,
        lastName: lastName || userFound.lastName,
        // pointages: {
        //   connect: { id: pointage }
        // },
        role: role,
      },
    });

    if (!updatedUser)
      return NextResponse.json({ message: "Error when updating user" }, { status: 500 });
    return NextResponse.json({ message: "User Modified" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
