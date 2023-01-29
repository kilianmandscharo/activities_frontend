interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export default function Button({ label, onClick, disabled }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled === undefined ? false : disabled}
      className={`${disabled ? "opacity-50" : "opacity-100"} py-2 px-4 bg-blue-500 text-white rounded`}
    >
      {label}
    </button>
  )
}
