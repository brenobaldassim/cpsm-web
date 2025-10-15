import { Loader2 } from "lucide-react"

export const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="size-16 animate-spin text-primary" />
    </div>
  )
}

export default Loading
