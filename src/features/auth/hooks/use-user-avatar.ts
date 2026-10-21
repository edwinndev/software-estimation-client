"use client"

import { useState, useEffect, useCallback } from "react"

const AVATAR_KEY_PREFIX = "user_avatar_"
const AVATAR_EVENT = "user-avatar-updated"

const readStoredAvatar = (userId?: string): string | null => {
  if (!userId || typeof window === "undefined") return null
  try {
    return localStorage.getItem(`${AVATAR_KEY_PREFIX}${userId}`)
  } catch {
    return null
  }
}

export const useUserAvatar = (userId?: string) => {
  const [avatar, setAvatarState] = useState<string | null>(() =>
    readStoredAvatar(userId)
  )
  const [prevUserId, setPrevUserId] = useState(userId)

  if (userId !== prevUserId) {
    setPrevUserId(userId)
    setAvatarState(readStoredAvatar(userId))
  }

  useEffect(() => {
    const handleUpdate = () => {
      setAvatarState(readStoredAvatar(userId))
    }

    window.addEventListener(AVATAR_EVENT, handleUpdate)
    window.addEventListener("storage", handleUpdate)

    return () => {
      window.removeEventListener(AVATAR_EVENT, handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [userId])

  const saveAvatar = useCallback(
    (dataUrl: string) => {
      if (!userId || typeof window === "undefined") return
      try {
        localStorage.setItem(`${AVATAR_KEY_PREFIX}${userId}`, dataUrl)
        setAvatarState(dataUrl)
        window.dispatchEvent(new Event(AVATAR_EVENT))
      } catch (err) {
        console.error("Error saving avatar to localStorage:", err)
      }
    },
    [userId]
  )

  const removeAvatar = useCallback(() => {
    if (!userId || typeof window === "undefined") return
    try {
      localStorage.removeItem(`${AVATAR_KEY_PREFIX}${userId}`)
      setAvatarState(null)
      window.dispatchEvent(new Event(AVATAR_EVENT))
    } catch (err) {
      console.error("Error removing avatar from localStorage:", err)
    }
  }, [userId])

  return {
    avatar,
    saveAvatar,
    removeAvatar,
  }
}
