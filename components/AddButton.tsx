interface AddButtonProps {
  onClick: () => void
  disabled: boolean
}

export default function AddButton({ onClick, disabled }: AddButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      <div className="bg-blue-500 w-8 h-8 rounded flex justify-center items-center">
        <div className="absolute h-4 w-1 bg-white" />
        <div className="absolute h-4 w-1 bg-white rotate-90 origin-center" />
      </div>
    </button>
  )
}
