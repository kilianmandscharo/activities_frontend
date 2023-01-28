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

interface ActivityItemProps {
  activity: Activity
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  const router = useRouter()

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

  return (
    <div
      key={activity.id}
      className={`${
        isMutating ? "opacity-70" : "opacity-100"
      } flex gap-4 justify-between items-center`}
    >
      <p>{activity.name}</p>
      <DeleteButton onClick={handleDelete} disabled={isPending} />
    </div>
  )
}
