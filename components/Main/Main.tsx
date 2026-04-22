import { useSession } from 'next-auth/react'
import MainFriend from './MainFriend'
import MainImportant from './MainImportant'
import MainStats from './MainStats'
import RecentMemos from './RecentMemos'
import RecentTodos from './RecentTodos'

const Main = () => {
  const { data: session } = useSession()
  return (
    <div>
      {session && session.user && (
        <>
          <div className="text-ui-md my-8 font-nanumgothic_bold text-center text-primary leading-relaxed">
            <span className="border-b-2 border-primary pb-1.5">
              안녕하세요✋ {session.user.name}님! 할일과 메모를 관리하고 친구와
              통계를 확인하세요📋
            </span>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <RecentMemos />
            <div>
              <RecentTodos />
              <MainImportant />
            </div>
            <div>
              <MainFriend />
              <MainStats />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
export default Main
