import { useState, useEffect, useRef } from "react"
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from '../firebase.config'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from "react-router-dom"
import Spinner from '/src/components/Spinner'
import { toast } from "react-toastify"


const CreateListing = () => {

    const [geolocationEnabled, setGeolocationEnabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0
    })

    const { type, name, bedrooms, bathrooms, parking, furnished, address, offer, regularPrice, discountedPrice, images, latitude, longitude } = formData

    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)

    useEffect(() => {

        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData({ ...formData, userRef: user.uid })
                } else {
                    navigate('/sign-in')
                }
            })
        }

        return () => {
            isMounted.false
        }
    }, [isMounted])

    const onSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)

        if (discountedPrice >= regularPrice) {
            setLoading(false)
            toast.error('Discounted price need to be less than regular price')
            return
        }

        if (images.length > 6) {
            setLoading(false)
            toast.error('Max 6 images')
            return
        }

        //Geolocation

        let geolocation = {}
        let location

        if (geolocationEnabled) {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyATwYqovyU3BRQpP3cOMYpZ4G5ZtoBxCMs`)

            const data = await response.json()
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0

            location = data.status === 'ZERO_RESULTS' ? undefined :
                data.results[0]?.formatted_address

            if (location === undefined || location.includes('undefined')) {
                setLoading(false)
                toast.error('Please enter a valid address')
                return
            }

        } else {
            geolocation.lat = latitude
            geolocation.lng = longitude
            location = address
        }

        //Store images in firebase

        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

                const storageRef = ref(storage, 'images/' + fileName)

                const uploadTask = uploadBytesResumable(storageRef, image)

                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        reject(error)
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );
            })
        }

        const imageUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch(() => {
            setLoading(false)
            toast.error('Images not uploaded')
            return
        })

        const formDataCopy = {
            ...formData,
            imageUrls,
            geolocation,
            timestamp: serverTimestamp()
        }

        delete formDataCopy.images
        delete formDataCopy.address
        location && (formDataCopy.location = location)
        !formDataCopy.offer && delete formDataCopy.discountedPrice

        const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
        setLoading(false)
        toast.success('Listing Saved!')
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }

    const onMutate = (e) => {
        let boolean = null;

        if (e.target.value === 'true') {
            boolean = true
        }
        if (e.target.value === 'false') {
            boolean = false
        }

        //Files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
        }

        //Text/Booleans/Numbers
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }))
        }

    }

    if (loading) {
        return <Spinner />
    }

    return (
        <div className="w-full flex flex-col justify-center items-center mb-5">
            <div className="w-11/12 mt-5 flex flex-row" >
                <form onSubmit={onSubmit} className="flex flex-col md:flex-row w-full justify-around gap-4">
                    <div className="flex flex-col gap-4">
                        <p className="text-3xl font-black">Create a Listing</p>
                        <div className="flex flex-col w-full">
                            <label className="font-bold">Sell / Rent</label>
                            <div className="flex flex-row gap-1 mt-2">
                                <button
                                    type="button"
                                    className={type === 'sale' ? `bg-accent text-white rounded-lg px-6 py-1` : `bg-white rounded-lg px-6 py-1`}
                                    id="type"
                                    value='sale'
                                    onClick={onMutate}>
                                    Sell
                                </button>
                                <button
                                    type="button"
                                    className={type === 'rent' ? `bg-accent text-white rounded-lg px-6 py-1` : `bg-white rounded-lg px-6 py-1`}
                                    id="type"
                                    value='rent'
                                    onClick={onMutate}>
                                    Rent
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col w-full">
                            <label className="font-bold">Name</label>
                            <div className="flex flex-row gap-1 w-full mt-2">
                                <input
                                    type="text"
                                    className='rounded-lg w-52 sm:w-96 md:w-64 lg:w-96 p-1'
                                    id="name"
                                    value={name}
                                    onChange={onMutate}
                                    maxLength='32'
                                    minLength='10'
                                    required>
                                </input>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="flex flex-col">
                                <label className="font-bold">Bedrooms</label>
                                <div className="flex flex-row gap-1 mt-2">
                                    <input
                                        type="number"
                                        className='w-10 rounded-lg p-1 text-center'
                                        id="bedrooms"
                                        value={bedrooms}
                                        onChange={onMutate}
                                        min='1'
                                        max='50'
                                        required>
                                    </input>
                                </div>
                            </div>
                            <div className="flex flex-col ">
                                <label className="font-bold">Bathrooms</label>
                                <div className="flex flex-row gap-1 mt-2">
                                    <input
                                        type="number"
                                        className='w-10 rounded-lg p-1 text-center'
                                        id="bathrooms"
                                        value={bathrooms}
                                        onChange={onMutate}
                                        min='1'
                                        max='50'
                                        required>
                                    </input>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col w-full">
                            <label className="font-bold">Parking spot</label>
                            <div className="flex flex-row gap-1 mt-2">
                                <button
                                    type="button"
                                    className={parking ? `bg-accent rounded-lg text-white px-6 py-1` : `bg-white rounded-lg px-6 py-1`}
                                    id="parking"
                                    value={true}
                                    onClick={onMutate}>
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className={!parking && parking !== null ? `bg-accent text-white rounded-lg px-6 py-1` : `bg-white rounded-lg px-6 py-1`}
                                    id="parking"
                                    value={false}
                                    onClick={onMutate}>
                                    No
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col w-full">
                            <label className="font-bold">Furnished</label>
                            <div className="flex flex-row gap-1 mt-2">
                                <button
                                    type="button"
                                    className={furnished ? `bg-accent text-white rounded-lg px-6 py-1` : `bg-white rounded-lg px-6 py-1`}
                                    id="furnished"
                                    value={true}
                                    onClick={onMutate}>
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className={!furnished && furnished !== null ? `bg-accent text-white rounded-lg px-6 py-1` : `bg-white rounded-lg px-6 py-1`}
                                    id="furnished"
                                    value={false}
                                    onClick={onMutate}>
                                    No
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col w-full">
                            <label className="font-bold">Address</label>
                            <textarea
                                className=" w-52 sm:w-96 md:w-64 lg:w-96 rounded-lg"
                                type='text'
                                id="address"
                                value={address}
                                onChange={onMutate}
                                required />
                        </div>

                        {!geolocationEnabled && (
                            <>
                                <div className="flex gap-5">
                                    <div className="flex flex-col">
                                        <label className="font-bold">Latitude</label>
                                        <div className="flex flex-row gap-1 mt-2">
                                            <input
                                                type="number"
                                                className='w-44 rounded-lg p-1 text-center'
                                                id="latitude"
                                                value={latitude}
                                                onChange={onMutate}
                                                required>
                                            </input>
                                        </div>
                                    </div>
                                    <div className="flex flex-col ">
                                        <label className="font-bold">Longitude</label>
                                        <div className="flex flex-row gap-1 mt-2">
                                            <input
                                                type="number"
                                                className='w-44 rounded-lg p-1 text-center'
                                                id="longitude"
                                                value={longitude}
                                                onChange={onMutate}
                                                required>
                                            </input>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 mt-0 md:mt-11">
                        <div className="flex flex-col gap-4">

                            <div className="flex flex-col w-full">
                                <label className="font-bold">Offer</label>
                                <div className="flex flex-row gap-1 mt-2">
                                    <button
                                        type="button"
                                        className={offer ? `bg-accent text-white rounded-lg px-6 py-1` : `bg-white rounded-lg px-6 py-1`}
                                        id="offer"
                                        value={true}
                                        onClick={onMutate}>
                                        Yes
                                    </button>
                                    <button
                                        type="button"
                                        className={!offer && offer !== null ? `bg-accent text-white rounded-lg px-6 py-1` : `bg-white rounded-lg px-6 py-1`}
                                        id="offer"
                                        value={false}
                                        onClick={onMutate}>
                                        No
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-5">
                                <div className="flex flex-col">
                                    <label className="font-bold">Regular Price</label>
                                    <div className="flex flex-row gap-5 mt-2 items-center">
                                        <input
                                            type="number"
                                            className='w-28 rounded-lg p-1 text-center'
                                            id="regularPrice"
                                            value={regularPrice}
                                            onChange={onMutate}
                                            min='50'
                                            max='750000000'
                                            required>
                                        </input>
                                        {type === 'rent' && <p className="font-bold">$/Month</p>}
                                    </div>
                                </div>
                            </div>

                            {offer && (
                                <div className="flex flex-col">
                                    <label className="font-bold">Discounted Price</label>
                                    <div className="flex flex-row gap-5 mt-2 items-center">
                                        <input
                                            type="number"
                                            className='w-28 rounded-lg p-1 text-center'
                                            id="discountedPrice"
                                            value={discountedPrice}
                                            onChange={onMutate}
                                            min='50'
                                            max='750000000'
                                            required>
                                        </input>
                                        {type === 'rent' && <p className="font-bold">$/Month</p>}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col">
                                <label className="font-bold">Images</label>
                                <p>The first image will be the cover (max 6).</p>
                                <div className="flex flex-row gap-5 mt-2 items-center">
                                    <input
                                        type="file"
                                        className='bg-white p-2 rounded-lg formInputFile w-64 sm:w-96 md:w-full'
                                        id="images"
                                        onChange={onMutate}
                                        max='6'
                                        accept=".jpg,.png,.jpeg"
                                        multiple
                                        required>
                                    </input>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="bg-accent p-2 rounded-lg w-64 sm:w-96 md:w-full text-white"
                                >Create Listing</button>
                            </div>


                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateListing
