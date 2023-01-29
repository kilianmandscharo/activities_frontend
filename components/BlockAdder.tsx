"use client"

import { Activity } from "@/schemas/schemas"
import { useRouter } from "next/navigation"
import Button from "./Button"

interface BlockAdderProps {
  activity: Activity
}

export default function BlockAdder({ activity }: BlockAdderProps) {
  const router = useRouter()

  function handleNewBlock() {
    router.push(`/activities/${activity.id}/new`)
  }

  return <Button onClick={handleNewBlock} label="Neuer Block" />
}
