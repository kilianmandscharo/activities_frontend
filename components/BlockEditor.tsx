"use client"

import dayjs, { Dayjs } from "dayjs"
import { useState } from "react"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import {
  DateTimePicker,
  LocalizationProvider,
  MobileTimePicker,
} from "@mui/x-date-pickers"
import { TextField } from "@mui/material"
import Button from "./Button"
import { useRouter } from "next/navigation"
import IconButton from "./IconButton"
import { Edit } from "@mui/icons-material"
import DeleteButton from "./DeleteButton"

async function addBlock(
  startTime: string,
  endTime: string,
  activityId: number,
  pauses: { startTime: string; endTime: string }[]
) {
  const body = {
    startTime: startTime,
    endTime: endTime,
    activityId: activityId,
    pauses: pauses,
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
  const [pauses, setPauses] = useState<
    { id: number; startTime: Dayjs; endTime: Dayjs }[]
  >([])

  const [editPause, setEditPause] = useState(false)
  const [pauseId, setPauseId] = useState(1)

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
    await addBlock(
      start.toString(),
      end.toString(),
      parseInt(activityId),
      pauses.map((p) => ({
        startTime: p.startTime.toString(),
        endTime: p.endTime.toString(),
      }))
    )
    router.push(`activities/${activityId}`)
  }

  function handlePauseStartChange(newValue: Dayjs | null, id: number) {
    if (
      newValue === null ||
      newValue.isBefore(start) ||
      newValue.isAfter(end) ||
      newValue.isAfter(currentPause?.endTime)
    ) {
      return
    }
    setPauses((prev) =>
      prev.map((p) => (p.id === id ? { ...p, startTime: newValue } : p))
    )
  }

  function handlePauseEndChange(newValue: Dayjs | null, id: number) {
    if (
      newValue === null ||
      newValue.isBefore(start) ||
      newValue.isAfter(end) ||
      newValue.isBefore(currentPause?.startTime)
    ) {
      return
    }
    setPauses((prev) =>
      prev.map((p) => (p.id === id ? { ...p, endTime: newValue } : p))
    )
  }

  function handleAddPause() {
    const id =
      pauses.length === 0 ? 1 : Math.max(...pauses.map((p) => p.id)) + 1
    setPauses((prev) => [...prev, { id: id, startTime: start, endTime: end }])
  }

  function handleDeletePause(id: number) {
    setPauses((prev) => prev.filter((p) => p.id !== id))
  }

  function handleEditPause(id: number) {
    setPauseId(id)
    setEditPause(true)
  }

  function handleExitPause() {
    setEditPause(false)
  }

  const currentPause = pauses.find((p) => p.id === pauseId)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="relative flex flex-col gap-8">
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
        <div className="flex flex-col gap-2">
          {pauses.map((p) => (
            <div className="flex gap-4 items-center">
              <p>Start: {p.startTime.format("HH:mm:ss").toString()}</p>
              <p>Ende: {p.endTime.format("HH:mm:ss").toString()}</p>
              <div className="flex gap-2">
                <IconButton
                  onClick={() => handleEditPause(p.id)}
                  icon={<Edit sx={{ color: "white" }} />}
                />
                <DeleteButton onClick={() => handleDeletePause(p.id)} />
              </div>
            </div>
          ))}
        </div>
        {editPause && currentPause !== undefined && (
          <>
            <div
              onClick={handleExitPause}
              className="absolute top-0 right-0 bottom-0 left-0 bg-black opacity-50"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-max flex items-end flex-col gap-4 p-4 bg-white z-10 rounded-xl shadow-md">
              <DeleteButton onClick={handleExitPause} />
              <MobileTimePicker
                label="Start"
                inputFormat="HH:mm:ss"
                value={currentPause.startTime}
                onChange={(e) => handlePauseStartChange(e, currentPause.id)}
                renderInput={(params) => <TextField {...params} />}
              />
              <MobileTimePicker
                label="Ende"
                inputFormat="HH:mm:ss"
                value={currentPause.endTime}
                onChange={(e) => handlePauseEndChange(e, currentPause.id)}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
          </>
        )}
        <div className="flex flex-col gap-2">
          <Button onClick={handleAddPause} label="Neue Pause" />
          <Button onClick={handleSave} label="Speichern" />
        </div>
      </div>
    </LocalizationProvider>
  )
}
