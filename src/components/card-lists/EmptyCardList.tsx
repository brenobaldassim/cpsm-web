interface EmptyCardListProps {
  message: string
}

export const EmptyCardList: React.FC<EmptyCardListProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full">
    <p className="text-muted-foreground">{`No ${message.toLowerCase()} found, create one to get started!`}</p>
  </div>
)
