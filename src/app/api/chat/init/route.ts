import { createClient } from '@/libs/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { chatId, message } = await request.json()

    // 사용자 ID 가져오기
    const userId = request.cookies.get('user_id')?.value

    if (!message) {
      return NextResponse.json(
        { message: '메시지가 필요합니다.' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    let answer = ''
    const newChatId = chatId

    if (!chatId) {
      // 처음하는 발화이면
      // 여기서 에이전트를 통해서 발화 생성.

      // answer = makeAnswer(message)
      answer = 'first text'

      // DB에 새로운 채팅 저장
      const initialChatHistory = [
        { role: 'user', content: message, timestamp: new Date().toISOString() },
        {
          role: 'assistant',
          content: answer,
          timestamp: new Date().toISOString(),
        },
      ]

      const { error: insertError } = await supabase.from('chat').insert({
        user_id: userId,
        chat_history: initialChatHistory,
      })

      if (insertError) {
        return NextResponse.json(
          { message: '채팅 저장 중 오류가 발생했습니다.' },
          { status: 500 }
        )
      }
    } else {
      // 처음하는 발화가 아니면 히스토리를 토대로 생성

      const { data, error } = await supabase
        .from('chat')
        .select('chat_history')
        .eq('id', chatId)
        .single()

      if (error || !data) {
        return NextResponse.json(
          { message: '채팅 내역을 찾을 수 없습니다.' },
          { status: 404 }
        )
      }

      const chat_history = data.chat_history // json 형식

      answer = 'after first text'

      // 기존 채팅 히스토리에 새로운 메시지 추가
      const updatedChatHistory = [
        ...chat_history,
        { role: 'user', content: message, timestamp: new Date().toISOString() },
        {
          role: 'assistant',
          content: answer,
          timestamp: new Date().toISOString(),
        },
      ]

      // DB 업데이트
      const { error: updateError } = await supabase
        .from('chat')
        .update({
          chat_history: updatedChatHistory,
          updated_at: new Date().toISOString(),
        })
        .eq('chat_id', chatId)
        .eq('user_id', userId)

      if (updateError) {
        return NextResponse.json(
          { message: '채팅 업데이트 중 오류가 발생했습니다.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      message: '발화 성공',
      utterance: answer,
      chatId: newChatId,
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: '발화 중 오류가 발생했습니다. 다시 시도해주십시오.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    )
  }
}
