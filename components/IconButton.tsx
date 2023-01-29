interface IconButtonProps {
  onClick: () => void
  disabled?: boolean
  icon: JSX.Element
}

export default function IconButton({
  onClick,
  disabled,
  icon,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled === undefined ? false : disabled}
      className="bg-blue-500 w-8 h-8 rounded flex justify-center items-center"
    >
      {icon}
    </button>
  )
}
