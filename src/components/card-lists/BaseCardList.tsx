import { EmptyCardList } from "./EmptyCardList"

interface BaseCardListProps {
  children: React.ReactNode
  emptyMessage: string
  isEmpty: boolean
}

export const BaseCardList: React.FC<BaseCardListProps> = ({
  children,
  emptyMessage,
  isEmpty,
}) => {
  if (isEmpty) {
    return <EmptyCardList message={emptyMessage} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {children}
    </div>
  )
}
