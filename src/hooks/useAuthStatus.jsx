import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"

export const useAuthStatus = () => {

    const [loggedIn, setLoggedIn] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)

    useEffect(() => {
        const auth = getAuth()
        console.log(auth)

        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user)
                setLoggedIn(true)
                console.log(loggedIn)
            }
            setCheckingStatus(false)
        })
    })


    return { loggedIn, checkingStatus }
}

