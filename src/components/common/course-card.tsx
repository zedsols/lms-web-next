import type { ReactNode } from "react";
import type { CourseWithProgress } from "~/queries/get-courses";

import { default as Link } from "next/link";
import { default as Image } from "next/image";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { formatCurrencyUS } from "~/lib/format";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";

interface CourseCardProps {
	course: CourseWithProgress;
}

export function CourseCard({ course }: Readonly<CourseCardProps>): ReactNode {
	return (
		<Link href={`/courses/${course.id}`}>
			<Card>
				<CardContent className={cn("relative p-0")}>
					<Image
						className="h-56 object-cover object-center"
						height={224}
						width={332}
						src={course.imageUrl as string}
						alt={course.title}
					/>
				</CardContent>
				<CardHeader className={cn("p-3 space-y-1")}>
					<CardTitle className={cn("text-lg")}>{course.title}</CardTitle>
					<CardDescription className={cn("text-sm")}>
						{course.category?.name}
					</CardDescription>
				</CardHeader>
				<CardFooter className={cn("p-3 pt-0 flex-col gap-2 items-stretch")}>
					<span className={cn("flex gap-2 items-center text-sm")}>
						<IconBadge className={cn("w-6 h-6")} size="sm" Icon={BookOpen} />
						<span>
							{course.chapters.length}{" "}
							{course.chapters.length > 1 ? "Chapters" : "Chapter"}
						</span>
					</span>
					<span>{formatCurrencyUS(course.price as number)}</span>
				</CardFooter>
			</Card>
		</Link>
	);
}
