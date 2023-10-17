import { useLocation, useNavigate } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config.jsx'
import { toast } from "react-toastify"
import { FcGoogle } from 'react-icons/fc'

const OAuth = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const onGoogleClick = async () => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user

            //Check for user
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            if (!docSnap.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            navigate('/')
        } catch (error) {
            toast.error('Could not authorize with Google')
        }
    }

    return (
        <div className="flex flex-col items-center gap-4 mt-14 mb-10">
            <p>Sign {location.pathname === '/sign-up' ? 'up ' : 'in '}
                with</p>
            <FcGoogle onClick={onGoogleClick} className="text-2xl cursor-pointer" />
        </div>
    )
}

export default OAuth
