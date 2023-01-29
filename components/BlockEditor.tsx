"use client"

import { Pause } from "@/schemas/schemas"
import dayjs, { Dayjs } from "dayjs"
import { useState } from "react"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { TextField } from "@mui/material"
import Button from "./Button"
import { useRouter } from "next/navigation"

async function addBlock(
  startTime: string,
  endTime: string,
  activityId: number
) {
  const body = {
    startTime: startTime,
    endTime: endTime,
    activityId: activityId,
  }
  return await fetch(`http://localhost:8080/block`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
}

interface BlockEditorProps {
  activityId: string
}

export default function BlockEditor({ activityId }: BlockEditorProps) {
  const router = useRouter()

  const [start, setStart] = useState<Dayjs>(dayjs().subtract(5, "minute"))
  const [end, setEnd] = useState<Dayjs>(dayjs())
  const [pauses, setPauses] = useState<Pause[]>([])

  function handleStartChange(newValue: Dayjs | null) {
    if (newValue !== null) {
      if (!newValue.isBefore(end)) {
        return
      }
      setStart(newValue)
    }
  }

  function handleEndChange(newValue: Dayjs | null) {
    if (newValue !== null) {
      if (!newValue.isAfter(end)) {
        return
      }
      setEnd(newValue)
    }
  }

  async function handleSave() {
    await addBlock(start.toString(), end.toString(), parseInt(activityId))
    router.push(`activities/${activityId}`)
  }

  return (
    <div className="flex flex-col gap-8">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="Start"
          inputFormat="DD/MM/YYYY HH:mm:ss"
          value={start}
          onChange={handleStartChange}
          renderInput={(params) => <TextField {...params} />}
        />
        <DateTimePicker
          label="Ende"
          inputFormat="DD/MM/YYYY HH:mm:ss"
          value={end}
          onChange={handleEndChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <Button onClick={handleSave} label="Speichern" />
    </div>
  )
}
