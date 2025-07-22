'use client'

import PromptEditModal from '@/components/prompts/PromptEditModal'
import { Prompt, User } from '@/types/index.type'
import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)

  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)

  const handleUpdatePrompt = (updated: Prompt) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
    )
  }
  useEffect(() => {
    const fetchData = async () => {
      const userRes = await fetch('/api/admin/users')
      const usersData = await userRes.json()

      const promptRes = await fetch('/api/admin/prompts')
      const promptsData = await promptRes.json()

      setUsers(usersData)
      setPrompts(promptsData)
      setLoading(false)
    }

    fetchData()
  }, [])

  const deletePrompt = async (id: string) => {
    if (!confirm('정말로 삭제하시겠습니까?')) return

    const res = await fetch('/api/admin/prompts', {
      method: 'DELETE',
      body: JSON.stringify({ promptId: id }),
    })

    if (res.ok) {
      setPrompts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  if (loading) return <div className="p-6">로딩 중...</div>

  console.log(prompts, users)
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">🛠️ 관리자 페이지</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">👤 사용자 목록</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-10 text-left">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">이름</th>
              <th className="p-2 border">이메일</th>
              <th className="p-2 border">가입일</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-2 border">{user.id}</td>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">
                  {new Date(user.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">📝 프롬프트 목록</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-10 text-left">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">제목</th>
              <th className="p-2 border">내용</th>
              <th className="p-2 border">생성일</th>
              <th className="p-2 border">관리</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map((prompt) => (
              <tr key={prompt.id}>
                <td className="p-2 border">{prompt.id}</td>
                <td className="p-2 border">{prompt.title}</td>
                <td className="p-2 border">{prompt.content}</td>
                <td className="p-2 border">
                  {new Date(prompt.created_at).toLocaleString()}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => setEditingPrompt(prompt)}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => deletePrompt(prompt.id)}
                    className="text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {editingPrompt && (
        <PromptEditModal
          prompt={editingPrompt}
          onClose={() => setEditingPrompt(null)}
          onSave={handleUpdatePrompt}
        />
      )}
    </div>
  )
}
