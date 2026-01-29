import React from 'react'
import MessageScreenComponent from './MessageScreenComponent'
import Message from './MessageComponent'

export default function MessageLayout() {
  return (
    <div className='flex flex-col w-full h-full overflow-hidden bg-[#313338]'>
      
      <div className="flex-1 overflow-y-auto">
        <MessageScreenComponent />
      </div>

      <div className="shrink-0">
        <Message />
      </div>
      
    </div>
  )
}