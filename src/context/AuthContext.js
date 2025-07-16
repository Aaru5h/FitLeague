'use client'
import { auth } from "@/services/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { Children, createContext, useEffect, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({children})=>{

    const [user,setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,(currentUser)=>{
            setUser(currentUser)
            setLoading(false)
        })

        return ()=> unsubscribe()
    },[])

    return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth =()=> createContext(AuthContext)