"use-client"
type Props = {
  name: string
  active?: boolean
}

export function ServerItem({ name, active }: Props) {
  return (
    <div
      className={`
        w-12 h-12
        rounded-full
        flex items-center justify-center
        bg-muted
        text-foreground
        cursor-pointer
        transition-all
        duration-200
        hover:rounded-xl
        ${active ? "bg-primary text-primary-foreground" : ""}
      `}
    >
      {name[0]}
    </div>
  )
}
