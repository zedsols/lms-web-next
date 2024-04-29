import {NextRequest, NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import {default as db} from "~/lib/db";


export async function PATCH(_request: NextRequest, {params}: {
  params: { courseId: string; chapterId: string }
}): Promise<NextResponse> {
  try {
    const {userId} = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      }
    })

    if (!ownCourse) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    const ownChapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      }
    })

    if (!ownChapter) {
      return new NextResponse("Unauthorized", {status: 401})
    }

    if (!ownChapter.title || !ownChapter.description || !ownChapter.videoUrl) {
      return new NextResponse("Missing Required Fields!", {status: 400})
    }

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true
      }
    })

    if (!ownCourse.isPublished) {
      const publishedChapters = await db.chapter.findMany(
        {
          where: {
            courseId: params.courseId,
            isPublished: true
          }
        },
      )

      if (publishedChapters.length > 0) {
        await db.course.update({
          where: {
            id: params.courseId,
          },
          data: {
            isPublished: true
          }
        })
      }
    }

    return NextResponse.json(chapter)
  } catch (error) {
    console.log("[COURSES_ID_CHAPTER_ID]", error)

    return new NextResponse("Internal Error", {status: 500})
  }
}
