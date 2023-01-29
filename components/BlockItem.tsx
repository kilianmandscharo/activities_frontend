"use client"

import { Block } from "@/schemas/schemas"
import dayjs from "dayjs"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import BlockTimeline from "./BlockTimeLine"
import DeleteButton from "./DeleteButton"

async function deleteBlock(id: number) {
  return await fetch(`http://localhost:8080/block/${id}`, {
    method: "DELETE",
  })
}

interface BlockItemProps {
  block: Block
}

export default function BlockItem({ block }: BlockItemProps) {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [isFetching, setIsFetching] = useState(false)

  const isMutating = isFetching || isPending

  const start = dayjs(block.startTime)
  const end = dayjs(block.endTime)

  async function handleDelete() {
    setIsFetching(true)
    await deleteBlock(block.id)
    setIsFetching(false)

    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div
      className={`${
        isMutating ? "opacity-70" : "opacity-100"
      } flex flex-col gap-4`}
    >
      <div className="flex gap-4">
        <div>
          <p>Start: {start.format("DD-MM-YYYY HH:mm:ss")}</p>
          <p>Ende: {end.format("DD-MM-YYYY HH:mm:ss")}</p>
        </div>
        <DeleteButton onClick={handleDelete} disabled={isPending} />
      </div>
      <BlockTimeline block={block} />
    </div>
  )
}
