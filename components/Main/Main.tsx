import { useSession } from 'next-auth/react'
import RecentMemos from './RecentMemos'
import RecentTodos from './RecentTodos'
import MainFriend from './MainFriend'
import MainStats from './MainStats'
import MainImportant from './MainImportant'
// import CheckAccess from './CheckAccess'

const Main = () => {
  const { data: session } = useSession()
  return (
    <div>
      {session && session.user && (
        <>
          <div className="underline underline-offset-[1rem] text-[2rem] my-[2rem] font-bold flex justify-center">
            안녕하세요✋ {session.user.name}님! 할일과 메모를 관리하고 친구와
            통계를 확인하세요📋
          </div>
          <div className="justify-between flex">
            <RecentMemos />
            <div>
              <RecentTodos />
              <MainImportant />
            </div>
            <div>
              <MainFriend />
              <MainStats />
              {/* <CheckAccess /> */}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
export default Main
