'use client'

import { useSession } from 'next-auth/react'
import { useCallback } from 'react'
import Button from '../Button'

export default function AddCalendar() {
  const { data: session } = useSession()

  const handleAddCalendar = useCallback(async () => {
    if (!session?.accessToken) {
      console.error('AccessToken is not available')
      return
    }

    const accessToken = session.accessToken
    const uid = crypto.randomUUID()
    const calendarId = 'defaultCalendarId'
    const scheduleIcalString = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:Naver Calendar',
      'CALSCALE:GREGORIAN',
      'BEGIN:VTIMEZONE',
      'TZID:Asia/Seoul',
      'BEGIN:STANDARD',
      'DTSTART:19700101T000000',
      'TZNAME:GMT+09:00',
      'TZOFFSETFROM:+0900',
      'TZOFFSETTO:+0900',
      'END:STANDARD',
      'END:VTIMEZONE',
      'BEGIN:VEVENT',
      'SEQUENCE:0',
      'CLASS:PUBLIC',
      'TRANSP:OPAQUE',
      `UID:${uid}`,
      'DTSTART;TZID=Asia/Seoul:20250628T090000',
      'DTEND;TZID=Asia/Seoul:20250628T100000',
      'SUMMARY:NaviyNote 2차 배포일',
      'DESCRIPTION:SJ-1220가 만든 NaviyNote의 2차 배포일입니다',
      'LOCATION:Online',
      'ORGANIZER;CN=Test Organizer:mailto:kindjin12@naver.com',
      'CREATED:20250625T000000Z',
      'LAST-MODIFIED:20250625T000000Z',
      'DTSTAMP:20250625T000000Z',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n')

    try {
      const response = await fetch('/api/naver/add-schedule', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken,
          calendarId,
          scheduleIcalString,
        }),
      })

      const data = await response.json()
      console.log('Calendar event created:', data)

      if (response.ok) {
        console.log('Event added')
      } else {
        console.log(`Event added Error : ${data?.error?.message}`)
      }
    } catch (error) {
      console.error('Event added Error', error)
    }
  }, [session])

  return (
    <Button
      type="button"
      onClick={handleAddCalendar}
      className={`text-ui-sm my-4 py-4 w-full border border-gray-200 rounded-xl transition-colors ${session?.accessToken ? 'bg-secondary text-white hover:opacity-90' : 'bg-gray-200 text-gray-500'}`}
      disabled={!session?.accessToken}
    >
      내 네이버캘린더에 배포일 일정 추가
    </Button>
  )
}
