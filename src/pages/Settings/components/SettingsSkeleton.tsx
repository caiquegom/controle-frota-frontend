import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-3">
      <Skeleton className="w-full h-14" />
      <Skeleton className="w-full h-14" />
    </div>
  )
}