import { Block, Pause } from "@/schemas/schemas"
import dayjs from "dayjs"

interface BlockTimelineProps {
  block: Block
}

export default function BlockTimeline({ block }: BlockTimelineProps) {
  const blockStart = dayjs(block.startTime).unix()
  const blockEnd = dayjs(block.endTime).unix()
  const totalSeconds = blockEnd - blockStart
  const width = 200
  const unit = width / totalSeconds

  function pauseDimensions(pause: Pause) {
    const start = dayjs(pause.startTime).unix()
    const end = dayjs(pause.endTime).unix()
    return [end - start, start - blockStart]
  }

  return (
    <div className={`relative h-8 w-[${width}px] bg-green-500`}>
      {block.pauses !== null &&
        block.pauses.map((p) => {
          const [pauseWidth, pauseLeft] = pauseDimensions(p)
          const w = pauseWidth * unit
          const l = pauseLeft * unit
          return (
            <div
              key={p.id}
              className={`h-8 z-10 bg-red-500 absolute top-0]`}
              style={{ width: w, left: l }}
            />
          )
        })}
    </div>
  )
}
