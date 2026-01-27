type Props = {
  name: string
  image?: string
  active?: boolean
}

export function ServerItem({ name, image, active }: Props) {
  return (
    <div
      className={`
        w-12 h-12
        rounded-full
        flex items-center justify-center
        bg-muted
        cursor-pointer
        overflow-hidden
      `}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-semibold">
          {name[0]}
        </span>
      )}
    </div>
  )
}
