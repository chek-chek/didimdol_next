import { createClient } from '@/libs/supabase/server'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface CreateChatParams {
  userId: string
  userMessage: string
  assistantMessage: string
}

export interface UpdateChatParams {
  chatId: string
  userId: string
  userMessage: string
  assistantMessage: string
}

export class ChatService {
  private supabase: any

  constructor() {
    this.supabase = null
  }

  private async getSupabaseClient() {
    if (!this.supabase) {
      this.supabase = await createClient()
    }
    return this.supabase
  }

  /**
   * 새로운 채팅을 생성하고 DB에 저장
   */
  async createChat({
    userId,
    userMessage,
    assistantMessage,
  }: CreateChatParams) {
    const supabase = await this.getSupabaseClient()

    const initialChatHistory: ChatMessage[] = [
      {
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString(),
      },
      {
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date().toISOString(),
      },
    ]

    const { data, error } = await supabase
      .from('chat')
      .insert({
        user_id: userId,
        chat_history: initialChatHistory,
      })
      .select('id')
      .single()

    if (error) {
      throw new Error(`채팅 저장 중 오류가 발생했습니다: ${error.message}`)
    }

    return {
      chatId: data.id,
      chatHistory: initialChatHistory,
    }
  }

  /**
   * 기존 채팅 히스토리를 가져옴
   */
  async getChatHistory(chatId: string, userId: string) {
    const supabase = await this.getSupabaseClient()

    const { data, error } = await supabase
      .from('chat')
      .select('chat_history')
      .eq('id', chatId)
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      throw new Error('채팅 내역을 찾을 수 없습니다.')
    }

    return data.chat_history as ChatMessage[]
  }

  /**
   * 기존 채팅에 새로운 메시지 추가
   */
  async updateChat({
    chatId,
    userId,
    userMessage,
    assistantMessage,
  }: UpdateChatParams) {
    const supabase = await this.getSupabaseClient()

    // 기존 채팅 히스토리 가져오기
    const existingChatHistory = await this.getChatHistory(chatId, userId)

    // 새로운 메시지 추가
    const updatedChatHistory: ChatMessage[] = [
      ...existingChatHistory,
      {
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString(),
      },
      {
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date().toISOString(),
      },
    ]

    // DB 업데이트
    const { error } = await supabase
      .from('chat')
      .update({
        chat_history: updatedChatHistory,
        updated_at: new Date().toISOString(),
      })
      .eq('id', chatId)
      .eq('user_id', userId)

    if (error) {
      throw new Error(`채팅 업데이트 중 오류가 발생했습니다: ${error.message}`)
    }

    return {
      chatHistory: updatedChatHistory,
    }
  }

  /**
   * 채팅 분석용 데이터 가져오기
   */
  async getChatForAnalysis(chatId: string, userId: string) {
    const supabase = await this.getSupabaseClient()

    const { data, error } = await supabase
      .from('chat')
      .select('*')
      .eq('id', chatId)
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      throw new Error('채팅 데이터를 찾을 수 없습니다.')
    }

    return data
  }
}

// 싱글톤 인스턴스 생성
export const chatService = new ChatService()
