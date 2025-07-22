'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.message || '로그인 실패')
      return
    }

    router.push('/admin')
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-[360px] p-6 relative">
        {/* 로고 */}
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo.svg" alt="로고" width={120} height={60} />
          <h2 className="text-lg font-semibold mt-2">로그인</h2>
        </div>

        {/* 입력 필드 */}
        <div className="space-y-3">
          <input
            type="email"
            placeholder="아이디"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* 버튼 */}
        <div className="mt-5 space-y-3">
          <button
            className="w-full bg-sky-500 text-white py-2 rounded-lg text-sm hover:bg-sky-600"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          <button
            className="w-full border border-sky-400 text-sky-500 py-2 rounded-lg text-sm hover:bg-sky-50"
            onClick={() => router.push('/signup')}
          >
            회원가입
          </button>
        </div>

        {/* 하단 텍스트 */}
        <div className="mt-4 text-center text-gray-500 text-xs">
          비밀번호 재설정
        </div>

        {/* 닫기 버튼 */}
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
