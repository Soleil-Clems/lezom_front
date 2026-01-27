import { ServerItem } from "@/components/ui-client/serverItem"

export default function HomePage() {
  return (
    <div className="p-10 flex gap-4 bg-background min-h-screen">
      <ServerItem name="RTC" />
      <ServerItem name="DEV" />
      <ServerItem name="Design" active />
    </div>
  )
}
