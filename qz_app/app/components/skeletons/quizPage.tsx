import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuizCardSkeleton() {
  return (
    <Card className="quiz-card">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-1/4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-1/2" />
      </CardContent>
    </Card>
  );
}

export function QuizPageSkeleton() {
  return (
    <div className="container relative mx-auto my-4 flex flex-col gap-2">
      <Skeleton className="h-8 w-1/2 m-4" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <QuizCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
