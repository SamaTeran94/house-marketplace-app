import { getAuth, updateProfile } from "firebase/auth"
import { useState } from "react"
import { updateDoc, doc } from "firebase/firestore"
import { db } from '../firebase.config'
import { useNavigate, Link } from "react-router-dom"
import { toast } from 'react-toastify'
import { FaHouse, FaAngleRight } from 'react-icons/fa6'

const Profile = () => {
    const auth = getAuth()
    console.log(auth)

    const [changeDetails, setChangeDetails] = useState(false)

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    const { name, email } = formData

    const navigate = useNavigate()

    const onLogout = () => {
        auth.signOut()
        navigate('/')
    }

    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                //Update display name in fb

                await updateProfile(auth.currentUser, {
                    displayName: name
                })

                //Upate in firestore
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name: name
                })

            }
        } catch (error) {
            toast.error('Could not update profile details')
        }
    }

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    return (

        <div className="w-full flex flex-col justify-center items-center">
            <div className="w-11/12 flex justify-between mt-5" >
                <p className="text-3xl font-black">My Profile</p>
                <button
                    type="button"
                    className="bg-accent text-sm rounded-xl p-1 text-white"
                    onClick={onLogout}>Logout</button>

            </div>
            <div className="w-11/12 flex justify-between mt-14" >
                <p className="text-md">Personal Details</p>
                <button
                    onClick={() => {
                        changeDetails && onSubmit()
                        setChangeDetails((prevState) => !prevState)
                    }}
                    type="button"
                    className=" text-sm rounded-xl p-1 text-accent font-bold">{changeDetails ? 'Done' : 'Change'}
                </button>

            </div>
            <div className="w-11/12 flex justify-between mt-5" >
                <form className="flex flex-col w-full bg-white rounded-lg p-2">
                    <input
                        className={!changeDetails ? `bg-white` : `bg-base-200`}
                        type="text"
                        id="name"
                        disabled={!changeDetails}
                        value={name}
                        onChange={onChange}
                    />
                    <input
                        className="bg-white"
                        type="text"
                        id="email"
                        disabled
                        value={email}
                        onChange={onChange}
                    />
                </form>
            </div>
            <Link to='/create-listing' className="w-11/12 flex justify-between mt-10 bg-white items-center p-2 rounded-lg">
                <FaHouse />
                <p>Sell or Rent your home</p>
                <FaAngleRight />
            </Link>
        </div>

    )
}

export default Profile
