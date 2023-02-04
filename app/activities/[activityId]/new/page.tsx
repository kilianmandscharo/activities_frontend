import BlockEditor from "@/components/BlockEditor";

interface NewProps {
  params: {activityId: string}
}

export default function New({ params }: NewProps) {
  return (
    <section className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold text-center">Neuer Block</h1>
      <BlockEditor activityId={parseInt(params.activityId)} mode="new" />
    </section>
  )
}
