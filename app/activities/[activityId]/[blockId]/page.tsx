import BlockEditor from "@/components/BlockEditor"

interface EditProps {
  params: { activityId: string; blockId: string }
}

export default async function Edit({ params }: EditProps) {
  return (
    <section className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold text-center">Neuer Block</h1>
      <BlockEditor
        blockId={parseInt(params.blockId)}
        activityId={parseInt(params.activityId)}
        mode="edit"
      />
    </section>
  )
}
