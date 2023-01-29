import BlockEditor from "@/components/BlockEditor"

export default function New({ params }: any) {
  return (
    <section className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold text-center">Neuer Block</h1>
      <BlockEditor activityId={params.blocks} />
    </section>
  )
}
