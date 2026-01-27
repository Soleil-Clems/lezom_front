import { ServerItem } from "@/components/ui/serverItem"

export default function DevPage() {
  return (
    <div className="p-10 flex gap-4 bg-background min-h-screen">
      <ServerItem name="RTC" />
      <ServerItem name="DEV" />
      <ServerItem name="Design" active />
    </div>
  )
}
