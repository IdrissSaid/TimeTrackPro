
import { NextResponse } from 'next/server'
import prisma from '@/db';
import verifyCode from '@/app/lib/verify';
import { headers } from 'next/headers';

export async function GET() {
  const code = headers()?.get('code')

  const verify = await verifyCode(code)

  if (verify)
    return verify
  try {
    const pointages = await prisma.pointage.findMany({
      select: {
        date: true,
        pause: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            code: true,
            role: true,
          },
        },
      },
    });
    return NextResponse.json({message: "Pointages récupérés !", pointages})
  } catch (err) {
    return NextResponse.json({message: err}, {status: 500})
  }
}

export async function POST(req: Request) {
  try {
    const { code, pause } = await req.json()
    let error
    const realCode = (code && (code[0] === "A" || code[0] === "a")) ? code.slice(1, code.length) : code

    const userFounded = await prisma.user?.findUnique({
      where : {
        code: realCode
      },
      include: {
        pointages: true
      }
    })
    if (!userFounded)
      error = {message: "User not found", status: 404}
    if (userFounded && (code[0] === "A" || code[0] === "a") && userFounded.role.indexOf("ADMIN") == -1)
      error = {message: "Access Denied", status: 403}

    if (!userFounded || error)
      return NextResponse.json({message: error?.message || "User not found"}, {status: error?.status || 404})
console.log(userFounded, code,)
    if (userFounded && (code[0] === "A" || code[0] === "a") && userFounded.role.indexOf("ADMIN") != -1) {
  console.log("ok")
  return NextResponse.json({redirect: `${process.env.URL}/admin`})
    }
    const newPointage = await prisma.pointage.create({
      data: {
        userId: userFounded.id,
        date: new Date(),
        pause: pause
      },
    });

    await prisma.user?.update({
      where: {
        id: userFounded.id
      },
      data: {
        pointages: {
          connect: {
            id: newPointage.id
          }
        }
      }
    });

    return NextResponse.json({message: "Opération réussite !"}, {status: 200})
  } catch (error : any) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  };
}

