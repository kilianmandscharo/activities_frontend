import BlockAdder from "@/components/BlockAdder"
import { Activity } from "@/schemas/schemas"

interface BlocksProps {
  params: { blocks: string }
}

async function getActivity(id: number) {
  const res = await fetch(`http://localhost:8080/activity/${id}`)
  const activity: Activity | null = await res.json()
  return activity
}

export default async function Blocks({ params }: BlocksProps) {
  const activity = await getActivity(parseInt(params.blocks))

  if (activity === null) return <div>Aktivität nicht geladen</div>
  return (
    <section className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold text-center">{activity.name}</h1>
      <div className="flex flex-col gap-4">
        {activity.blocks === null || activity.blocks.length === 0 ? (
          <p className="text-center italic">--- Keine Blöcke ---</p>
        ) : (
          activity.blocks.map((b) => <div key={b.id} className="flex gap-4">
              <p>{b.startTime}</p>
              <p>{b.endTime}</p>
            </div>)
        )}
      </div>
      <BlockAdder activity={activity} />
    </section>
  )
}
