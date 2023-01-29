"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import AddButton from "./AddButton"

async function addActivity(name: string) {
  const body = { name: name, userId: 1 }
  return await fetch("http://localhost:8080/activity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
}

export default function ActivityAdder() {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [isFetching, setIsFetching] = useState(false)
  const [input, setInput] = useState("")

  const isMutating = isFetching || isPending

  async function handleAdd() {
    setIsFetching(true)
    await addActivity(input)
    setIsFetching(false)
    setInput("")

    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div
      className={`${
        isMutating ? "opacity-70" : "opacity-100"
      } flex gap-4 justify-center items-center`}
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="p-2 rounded"
        placeholder="Neue Aktivität"
        disabled={isPending}
      />
      <AddButton
        onClick={handleAdd}
        disabled={isPending || input.length === 0}
      />
    </div>
  )
}
