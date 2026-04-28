import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { accessToken, calendarId, scheduleIcalString } = body

    const res = await fetch(
      'https://openapi.naver.com/calendar/createSchedule.json',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          calendarId,
          scheduleIcalString,
        }).toString(),
      }
    )

    const rawRes = await res.text()
    if (process.env.NODE_ENV === 'development') {
      console.log('[네이버 응답 상태코드]', res.status)
      console.log('[네이버 응답 본문]', rawRes)
    }

    try {
      const data = JSON.parse(rawRes)
      return NextResponse.json(data, { status: res.status })
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON', raw: rawRes },
        { status: res.status }
      )
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[네이버 프록시 에러]', error)
    }
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 }
    )
  }
}
