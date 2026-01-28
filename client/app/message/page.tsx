import Message from "@/components/ui-client/messageComponent";
import MessageScreenComponent from "@/components/ui-client/MessageScreenComponent";

export default function Page() {
  return (
    <div className="relative h-screen">
        <MessageScreenComponent/>
        <Message />
    
    </div>
  );
}
