"use client"

import Link from "next/link"
import { useSidebar } from "@/components/ui/sidebar"


type Props = {
  id: string       
  name: string
  image?: string
  active?: boolean
}

export function ServerItem({ id, name, image, active }: Props) {
  const {openMobile, setOpenMobile} = useSidebar()


  return (
    <Link
    onClick={()=>setOpenMobile(false)}
     href={`/servers/${id}`}
      className="flex items-center gap-3 w-full group cursor-pointer px-4 md:px-0">
      
      <div
        className={`
          w-12 h-12
          shrink-0 
          rounded-full
          flex items-center justify-center
          bg-muted
          overflow-hidden
          transition-all duration-200
          ${active 
            ? 'rounded-[16px] bg-primary text-white' 
            : 'hover:rounded-[16px] hover:bg-primary hover:text-red-500'
          }
        `}
      >
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-semibold uppercase">
            {name[0]}
          </span>
        )}
      </div>

      <span className={`
        block md:hidden 
        font-bold truncate
        ${active ? 'text-white' : 'text-zinc-400 group-hover:text-white'}
      `}>
        {name}
      </span>
      
    </Link>
  )
}