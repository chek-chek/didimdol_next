'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [chatId, setChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = input.trim()

    // Optimistic UI update
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          chatId,
          message: userMessage,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || '오류 발생')

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.utterance },
      ])
      if (data.chatId) {
        setChatId(data.chatId)
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ 오류가 발생했습니다.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full p-4">
      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-4 h-full">
          <ScrollArea className="h-full pr-4">
            <div className="flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-3 max-w-[75%] ${
                    msg.role === 'user'
                      ? 'self-end bg-blue-10'
                      : 'self-start bg-gray-10'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className="self-start text-gray-500 text-sm">
                  Typing...
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <div className="mt-4 flex items-center gap-2">
        <Input
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <Button onClick={sendMessage} disabled={loading || !input.trim()}>
          전송
        </Button>
      </div>
    </div>
  )
}
