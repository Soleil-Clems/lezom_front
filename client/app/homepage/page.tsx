import { ServerSidebar } from "@/components/ui-client/serversidebar"
import { ServerItem } from "@/components/ui-client/serverItem"


export default function HomePage() {
  return (
    <ServerSidebar>
      <ServerItem name="RTC" />
      <ServerItem name="DEV" />
      <ServerItem name="DESIGN" />
    </ServerSidebar>
  )
}
