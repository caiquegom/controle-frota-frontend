import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="w-full h-28" />
        <Skeleton className="w-full h-28" />
        <Skeleton className="w-full h-28" />
      </div>
      <Skeleton className="mt-2 w-full h-[120px]" />

    </>

  )
}