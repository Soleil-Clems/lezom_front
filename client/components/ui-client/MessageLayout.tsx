import Message from "./messageComponent";
import MessageScreenComponent from "./MessageScreenComponent";

export default function MessageLayout() {
  return (
    <div className='flex flex-col flex-1 h-full overflow-hidden bg-[#313338]'>
      
      <div className="flex-1 overflow-y-auto">
        <MessageScreenComponent />
      </div>

      <div className="shrink-0">
        <Message />
      </div>
      
    </div>
  )
}