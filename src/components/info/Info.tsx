import { InfoIcon } from "lucide-react"

interface InfoProps {
  text: string
}

export const Info: React.FC<InfoProps> = ({ text }) => {
  return (
    <div className="relative mb-6 p-4 bg-primary-foreground border border-primary/20 rounded-md">
      <p className="text-base text-primary ">{text}</p>
      <InfoIcon className="size-4 text-primary absolute top-2 right-2" />
    </div>
  )
}
