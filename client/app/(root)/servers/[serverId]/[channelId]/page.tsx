import MessageLayout from "@/components/ui-client/MessageLayout";

export default async function ChannelPage({ params }: { params: Promise<{ channelId: string }> }) {
    const { channelId } = await params;
    return (
    <div className="w-full h-full bg-[#313338]">
      <MessageLayout channelId={channelId}/>
    </div>
  )
}