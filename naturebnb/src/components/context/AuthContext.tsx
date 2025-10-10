import React, { createContext, useContext, useEffect, useState } from "react"

type UserShape = Record<string, unknown> | null

type AuthContextShape = {
    user: UserShape
    setUser: (u: UserShape) => void
}

const AuthContext = createContext<AuthContextShape | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserShape>(() => {
        try {
            const raw = localStorage.getItem("user")
            return raw ? (JSON.parse(raw) as UserShape) : null
        } catch {
            return null
        }
    })

    useEffect(() => {
        try {
            if (user) localStorage.setItem("user", JSON.stringify(user))
            else localStorage.removeItem("user")
        } catch (e) {
            console.warn("AuthProvider: failed to sync localStorage", e)
        }
    }, [user])

    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}

export default AuthContext
