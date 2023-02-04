"use client"

import dayjs, { Dayjs } from "dayjs"
import { useEffect, useState } from "react"
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
import { Edit, InfoOutlined } from "@mui/icons-material"
import DeleteButton from "./DeleteButton"
import { Block } from "@/schemas/schemas"

async function getBlock(id: number) {
  const res = await fetch(`http://localhost:8080/block/${id}`)
  const block: Block | undefined = await res.json()
  return block
}

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

async function updateBlock(
  id: number,
  startTime: string,
  endTime: string,
  activityId: number,
  pauses: { startTime: string; endTime: string }[]
) {
  const body = {
    id: id,
    startTime: startTime,
    endTime: endTime,
    activityId: activityId,
    pauses: pauses,
  }
  return await fetch(`http://localhost:8080/block`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
}

type InvalidPause = "endBeforeStart" | "outOfBounds"

interface PauseEdit {
  id: number
  startTime: Dayjs
  endTime: Dayjs
}

interface BlockEditorProps {
  mode: "new" | "edit"
  blockId?: number
  activityId: number
}

export default function BlockEditor({
  mode,
  blockId,
  activityId,
}: BlockEditorProps) {
  const router = useRouter()

  const [start, setStart] = useState<Dayjs>()
  const [end, setEnd] = useState<Dayjs>()
  const [pauses, setPauses] = useState<PauseEdit[]>([])

  const [editPause, setEditPause] = useState(false)
  const [pauseId, setPauseId] = useState(1)

  useEffect(() => {
    if (mode === "new") {
      initNew()
    } else {
      initEdit()
    }
  }, [])

  function initNew() {
    const now = dayjs()
    setStart(now.subtract(15, "minute"))
    setEnd(now)
  }

  async function initEdit() {
    // blockId can't be undefined if the mode is "edit"
    const block = await getBlock(blockId!)
    if (block !== undefined) {
      setStart(dayjs(block.startTime))
      setEnd(dayjs(block.endTime))
      if (block.pauses !== null) {
        setPauses(
          block.pauses.map((p, i) => ({
            id: p.id,
            startTime: dayjs(p.startTime),
            endTime: dayjs(p.endTime),
          }))
        )
      }
    }
  }

  function handleStartChange(newValue: Dayjs | null) {
    if (newValue !== null) {
      setStart(newValue)
    }
  }

  function handleEndChange(newValue: Dayjs | null) {
    if (newValue !== null) {
      setEnd(newValue)
    }
  }

  async function handleSave() {
    if (mode === "new") {
      await saveNew()
    } else {
      await saveEdit()
    }
    router.push(`activities/${activityId}`)
  }

  async function saveNew() {
    if (start === undefined || end === undefined) {
      return
    }
    await addBlock(
      start.toString(),
      end.toString(),
      activityId,
      pauses.map((p) => ({
        startTime: p.startTime.toString(),
        endTime: p.endTime.toString(),
      }))
    )
  }

  async function saveEdit() {
    if (start === undefined || end === undefined) {
      return
    }
    // blockId can't be undefined in edit mode
    await updateBlock(
      blockId!,
      start.toString(),
      end.toString(),
      activityId,
      pauses.map((p) => ({
        startTime: p.startTime.toString(),
        endTime: p.endTime.toString(),
      }))
    )
  }

  function handlePauseStartChange(newValue: Dayjs | null, id: number) {
    if (newValue === null) {
      return
    }
    setPauses((prev) =>
      prev.map((p) => (p.id === id ? { ...p, startTime: newValue } : p))
    )
  }

  function handlePauseEndChange(newValue: Dayjs | null, id: number) {
    if (newValue === null) {
      return
    }
    setPauses((prev) =>
      prev.map((p) => (p.id === id ? { ...p, endTime: newValue } : p))
    )
  }

  function handleAddPause() {
    if (start === undefined || end === undefined) {
      return
    }
    const id =
      pauses.length === 0 ? 1 : Math.max(...pauses.map((p) => p.id)) + 1
    setPauses((prev) => [...prev, { id: id, startTime: start, endTime: end }])
    handleEditPause(id)
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

  function invalidPause(p: PauseEdit): InvalidPause | false {
    if (p.endTime.isBefore(p.startTime)) {
      return "endBeforeStart"
    }
    if (p.startTime.isBefore(start) || p.endTime.isAfter(end)) {
      return "outOfBounds"
    }
    return false
  }

  const currentPause = pauses.find((p) => p.id === pauseId)

  function blockInvalid() {
    return start?.isAfter(end)
  }

  function pauseInvalid() {
    return pauses.map((p) => invalidPause(p)).some((p) => p !== false)
  }

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
        {blockInvalid() && (
          <p className="flex justify-center align-center gap-4">
            <InfoOutlined />
            Start liegt nach Ende
          </p>
        )}
        <div className="flex flex-col gap-2">
          {pauses.length === 0 ? (
            <p className="text-center italic">Keine Pausen</p>
          ) : (
            pauses.map((p) => {
              const invalid = invalidPause(p)
              return (
                <div key={p.id}>
                  {invalid !== false && (
                    <p className="flex justify-between items-center gap-4">
                      <InfoOutlined />
                      {invalid === "outOfBounds"
                        ? "Pause liegt außerhalb des Blocks"
                        : "Pausenende liegt vor dem Start"}
                    </p>
                  )}
                  <div
                    className={`${
                      invalid !== false ? "text-red-500" : ""
                    } flex gap-4 items-center`}
                  >
                    <p className="text-lg">{p.id}</p>
                    <p>{p.startTime.format("HH:mm:ss").toString()}</p>
                    <p>{p.endTime.format("HH:mm:ss").toString()}</p>
                    <div className="flex gap-2">
                      <IconButton
                        onClick={() => handleEditPause(p.id)}
                        icon={<Edit sx={{ color: "white" }} />}
                      />
                      <DeleteButton onClick={() => handleDeletePause(p.id)} />
                    </div>
                  </div>
                </div>
              )
            })
          )}
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
          <Button
            onClick={handleSave}
            label="Speichern"
            disabled={blockInvalid() || pauseInvalid()}
          />
        </div>
      </div>
    </LocalizationProvider>
  )
}
