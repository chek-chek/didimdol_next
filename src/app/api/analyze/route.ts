import { createClient } from '@/libs/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { chatId, userId } = await request.json()
    if (!chatId || !userId) {
      return NextResponse.json(
        { message: '알 수 없는 오류입니다. 다시 시도해주십시오.' },
        { status: 500 }
      )
    }

    const supabase = await createClient()

    // 1, chat 에 들어있는 내역 확인하기
    const { data, error } = await supabase
      .from('chat')
      .select('*')
      .eq('chat_id', chatId)
      .eq('user_id', userId)
      .single()

    const chat_history = data.chat_history

    // chat history 가 없거나, 가져올 때 error가 있었다면
    if (!chat_history || error) {
      return NextResponse.json(
        { message: '알 수 없는 오류입니다. 다시 시도해주십시오.' },
        { status: 500 }
      )
    }

    // 여기 이제 agent 통해서 분석하기
    const analyzed_data = '대충 분석된 데이터.'

    return NextResponse.json({
      message: '분석이 완료되었습니다.',
      analyzed_data,
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: '분석 중 에러입니다. 다시 시도해주십시오.',
        error,
      },
      { status: 500 }
    )
  }
}
