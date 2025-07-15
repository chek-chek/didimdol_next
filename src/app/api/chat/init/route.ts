import { createClient } from '@/libs/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { chatId, message } = await request.json()
    const supabase = await createClient()

    let answer = ''
    if (!chatId) {
      // -> 처음하는 발화이면
      // 여기서 에이전트를 통해서 발화 생성.

      // db에 저장하는 로직? 여기서 할까 말까

      // answer = makeAnswer(message)
      answer = 'first text'
    } else {
      // 처음하는 발화가 아니면 내역을 토대로 생성?

      const { data, error } = await supabase
        .from('chat')
        .select('chat_history')
        .eq('chat_id', chatId)
        .single()

      const chat_history = data?.chat_history // json 형식

      // chat history 사용해서 발화 생성
      //  answer = makeAnswer(chatHistory)
      answer = 'after first text'
    }

    return NextResponse.json({
      message: '발화 성공',
      utterance: answer,
    })
  } catch (error) {}
}
