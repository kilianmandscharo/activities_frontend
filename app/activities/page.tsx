import ActivityAdder from "@/components/ActivityAdder"
import ActivityItem from "@/components/ActivityItem"
import { Activity } from "@/schemas/schemas"

async function getActivities() {
  const res = await fetch("http://localhost:8080/activities/1")
  const activities: Activity[] | null = await res.json()
  return activities === null ? [] : activities
}

export default async function Activities() {
  const activities = await getActivities()

  return (
    <section className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold text-center">Aktivitäten</h1>
      <div className="flex flex-col gap-4">
        {activities.length === 0 && (
          <p className="text-center italic">--- Keine Aktivitäten ---</p>
        )}
        {activities.map((a) => (
          <ActivityItem key={a.id} activity={a} />
        ))}
      </div>
      <ActivityAdder />
    </section>
  )
}
