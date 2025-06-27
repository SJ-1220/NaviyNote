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
    console.log('[네이버 응답 상태코드]', res.status)
    console.log('[네이버 응답 본문]', rawRes)

    try {
      const data = JSON.parse(rawRes)
      return NextResponse.json(data, { status: res.status })
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON', raw: rawRes },
        { status: res.status }
      )
    }
  } catch (error) {
    console.log('서버 프록시 에러', error)
    return NextResponse.json(
      { error: 'Server error', details: String(error) },
      { status: 500 }
    )
  }
}
