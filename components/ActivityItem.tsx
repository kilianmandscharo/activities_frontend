"use client"

import { Activity } from "@/schemas/schemas"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import DeleteButton from "./DeleteButton"

async function deleteActivity(id: number) {
  return await fetch(`http://localhost:8080/activity/${id}`, {
    method: "DELETE",
  })
}

async function updateActivity(name: string, activity: Activity) {
  return await fetch(`http://localhost:8080/activity`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({...activity, name: name}),
  })
}

interface ActivityItemProps {
  activity: Activity
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  const router = useRouter()

  const [input, setInput] = useState(activity.name)
  const [editing, setEditing] = useState(false)

  const [isPending, startTransition] = useTransition()
  const [isFetching, setIsFetching] = useState(false)

  const isMutating = isFetching || isPending

  async function handleDelete() {
    setIsFetching(true)
    await deleteActivity(activity.id)
    setIsFetching(false)

    startTransition(() => {
      router.refresh()
    })
  }

  async function handleUpdate() {
    if (editing) {
      setIsFetching(true)
      await updateActivity(input, activity)
      setIsFetching(false)
      setEditing(false)

      startTransition(() => {
        router.refresh()
      })
    } else {
      setEditing(true)
    }
  }

  return (
    <div
      key={activity.id}
      className={`${
        isMutating ? "opacity-70" : "opacity-100"
      } flex gap-4 justify-between items-center`}
    >
      {!editing ? (
        <p>{activity.name}</p>
      ) : (
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="py-1 px-2 rounded"
        />
      )}
      <div className="flex justify-center items-center gap-2">
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white py-1 rounded w-24"
        >
          {editing ? "Ok" : "Bearbeiten"}
        </button>
        <DeleteButton onClick={handleDelete} disabled={isPending} />
      </div>
    </div>
  )
}
