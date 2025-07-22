import { NextRequest, NextResponse } from 'next/server'
import { chatService } from '@/services/chat.service'

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

    let answer = ''
    let finalChatId = chatId

    if (!chatId) {
      // 처음하는 발화이면
      // 여기서 에이전트를 통해서 발화 생성.
      // answer = makeAnswer(message)

      answer = 'first text'

      // 새로운 채팅 생성
      const result = await chatService.createChat({
        userId,
        userMessage: message,
        assistantMessage: answer,
      })
      finalChatId = result.chatId
    } else {
      // 처음하는 발화가 아니면 히스토리를 토대로 생성
      answer = 'second text'

      // 기존 채팅 업데이트
      await chatService.updateChat({
        chatId,
        userId,
        userMessage: message,
        assistantMessage: answer,
      })
    }

    return NextResponse.json({
      message: '발화 성공',
      utterance: answer,
      chatId: finalChatId,
    })
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : '발화 중 오류가 발생했습니다. 다시 시도해주십시오.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    )
  }
}
