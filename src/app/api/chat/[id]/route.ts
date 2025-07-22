import { NextResponse } from 'next/server'
import { chatService } from '@/services/chat.service'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const chatId = params.id
  const userId = req.headers.get('x-user-id') // 클라이언트에서 보내주는 userId

  if (!userId) {
    return NextResponse.json({ error: 'userId 누락됨' }, { status: 400 })
  }

  try {
    const chat = await chatService.getChatForAnalysis(chatId, userId)
    return NextResponse.json(chat)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
