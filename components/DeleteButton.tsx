interface DeleteButtonProps {
  onClick: () => void
  disabled?: boolean
}

export default function DeleteButton({ onClick, disabled }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled === undefined ? false : disabled}
    >
      <div className="bg-red-500 w-8 h-8 rounded flex justify-center items-center">
        <div className="absolute h-4 w-1 bg-white rotate-45 origin-center" />
        <div className="absolute h-4 w-1 bg-white -rotate-45 origin-center" />
      </div>
    </button>
  )
}
