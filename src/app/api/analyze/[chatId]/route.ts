import { NextResponse } from 'next/server'
import { getChatHistoryFromId } from '@/services/analyze.service'

export async function GET(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  const chatId = params.chatId

  try {
    const data = await getChatHistoryFromId(chatId)
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
