"use client"

import { useCallback, useEffect, useState } from "react"
import { apiFetchBlob } from "@/lib/api"
import { usersService } from "@/features/users/services/users-service"

const AVATAR_EVENT = "user-avatar-updated"

export const useUserAvatar = (userId?: string) => {
  const [avatar, setAvatar] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadAvatar = useCallback(async () => {
    if (!userId) {
      setAvatar((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous)
        }
        return null
      })
      return
    }

    setIsLoading(true)
    try {
      const blob = await apiFetchBlob(`/api/v1/users/${userId}/avatar`)
      const objectUrl = URL.createObjectURL(blob)
      setAvatar((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous)
        }
        return objectUrl
      })
    } catch {
      setAvatar((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous)
        }
        return null
      })
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    const handleUpdate = () => {
      void loadAvatar()
    }

    const frame = requestAnimationFrame(() => {
      void loadAvatar()
    })

    window.addEventListener(AVATAR_EVENT, handleUpdate)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener(AVATAR_EVENT, handleUpdate)
    }
  }, [loadAvatar])

  useEffect(() => {
    return () => {
      if (avatar) {
        URL.revokeObjectURL(avatar)
      }
    }
  }, [avatar])

  const saveAvatar = useCallback(
    async (file: File) => {
      if (!userId) {
        return
      }

      await usersService.uploadAvatar(userId, file)
      window.dispatchEvent(new Event(AVATAR_EVENT))
      await loadAvatar()
    },
    [loadAvatar, userId]
  )

  const removeAvatar = useCallback(async () => {
    if (!userId) {
      return
    }

    await usersService.deleteAvatar(userId)
    window.dispatchEvent(new Event(AVATAR_EVENT))
    setAvatar((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous)
      }
      return null
    })
  }, [userId])

  return {
    avatar,
    isLoading,
    saveAvatar,
    removeAvatar,
    reloadAvatar: loadAvatar,
  }
}
