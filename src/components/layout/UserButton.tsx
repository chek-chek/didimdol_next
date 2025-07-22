'use client'

import { User } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import LoginModal from '../auth/authModal'

export default function UserButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const logout = useAuthStore((state) => state.logout)
  const router = useRouter()

  const handleIconClick = () => {
    if (isLoggedIn) {
      setShowDropdown((prev) => !prev)
    } else {
      setIsOpen(true)
    }
  }

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
  }

  const handleGoToMypage = () => {
    router.push('/mypage')
    setShowDropdown(false)
  }

  return (
    <>
      <div className="fixed top-6 right-10">
        <div
          onClick={handleIconClick}
          className="p-1.5 rounded-4 cursor-pointer bg-white border border-gray-20"
        >
          {isLoggedIn ? <User /> : <div>로그인</div>}
        </div>

        {showDropdown && (
          <div className="absolute right-0 top-10 w-40 bg-white border rounded-md shadow-md z-50">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-10 text-sm"
              onClick={handleGoToMypage}
            >
              마이페이지
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-10 text-sm"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <LoginModal
          onClose={() => {
            setIsOpen(false)
          }}
        />
      )}
    </>
  )
}
