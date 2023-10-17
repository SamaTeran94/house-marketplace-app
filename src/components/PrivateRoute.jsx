import { Navigate, Outlet } from "react-router-dom"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"

const PrivateRoute = () => {

    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        const auth = getAuth()
        console.log(auth)

        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true)
                console.log(loggedIn)
            }
        })
    })

    return loggedIn === true ? <Outlet /> : <Navigate to='/sign-in' />
}

export default PrivateRoute
