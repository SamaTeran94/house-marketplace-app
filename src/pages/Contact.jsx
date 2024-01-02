import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { doc, getDoc } from 'firebase/firestore'
import { db } from "../firebase.config"
import { toast } from "react-toastify"

const Contact = () => {

    const [message, setMessage] = useState('')
    const [landlord, setLandlord] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()

    const params = useParams()

    useEffect(() => {
        const getLandlord = async () => {
            const docRef = doc(db, 'users', params.landlordId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setLandlord(docSnap.data())
            } else {
                toast.error('Could not get landlord data')
            }
        }

        getLandlord()

    }, [params.landlordId])

    const onChange = (e) => setMessage(e.target.value)

    return (
        <div className="flex flex-col gap-8 m-4">
            <header>
                <p className="font-bold text-xl">Contact Landlord</p>
            </header>

            {landlord !== null && (
                <main>
                    <div className="mb-10">
                        <p className="font-semibold">Contact {landlord?.name}</p>
                    </div>

                    <form className="flex flex-col gap-10">
                        <div className="flex flex-col">
                            <label htmlFor="message">
                                Message
                            </label>
                            <textarea className="w-full h-32" name="message" id="message"
                                value={message} onChange={onChange}>
                            </textarea>
                        </div>

                        <a className="flex justify-center" href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
                            <button className="bg-accent w-1/2 rounded-lg p-2 text-center text-white" type="button">
                                Send Message
                            </button>
                        </a>
                    </form>
                </main>
            )}
        </div>
    )
}

export default Contact