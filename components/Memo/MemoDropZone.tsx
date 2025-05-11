import { useDrop } from 'react-dnd'
import { ReactNode, useRef } from 'react'

interface MemoDropZoneProps {
  zoneIsActive: boolean
  zoneIsImportant: boolean
  MemoDrop: (id: string, newActive: boolean, newImportant: boolean) => void
  children: ReactNode
}

const MemoDropZone = ({
  zoneIsActive,
  zoneIsImportant,
  MemoDrop,
  children,
}: MemoDropZoneProps) => {
  const memoDropRef = useRef<HTMLDivElement>(null)
  const [{ isOver }, drop] = useDrop({
    accept: 'MEMO',
    drop: (item: { id: string }) => {
      MemoDrop(item.id, zoneIsActive, zoneIsImportant)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })
  drop(memoDropRef)
  return (
    <div
      ref={memoDropRef}
      className={`${isOver ? 'text-gray-400' : 'text-white'}`}
    >
      {children}
    </div>
  )
}
export default MemoDropZone
