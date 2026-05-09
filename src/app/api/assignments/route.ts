import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.formData();

    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const dueDate = data.get("dueDate") as string;
    const maxScore = Number(data.get("maxScore"));
    const courseId = data.get("courseId") as string;

    const file = data.get("file") as File | null;
    const linkUrl = data.get("linkUrl") as string;

    console.log({
      title,
      description,
      dueDate,
      maxScore,
      courseId,
      file,
      linkUrl,
    });

    /*
    ============================================
    SIMPAN KE DATABASE
    ============================================
    */

    // contoh prisma
    /*
    await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        maxScore,
        courseId,
        attachmentUrl: linkUrl || null,
      },
    });
    */

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Gagal membuat assignment",
      },
      {
        status: 500,
      }
    );
  }
}