import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner.jsx'
import { FaShareNodes } from "react-icons/fa6";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const Listing = () => {

    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                console.log(docSnap.data())
                setListing(docSnap.data())
                setLoading(false)
            }
        }

        fetchListing()
    }, [])

    if (loading) {
        return <Spinner />
    }

    return (
        <main>

            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                // pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
            >
                {listing.imageUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                        <div className="w-full bg-red-200 h-96" style={{ background: `url(${listing.imageUrls[index]}) center no-repeat`, backgroundSize: 'cover' }}>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="m-4 flex flex-col gap-1">
                <div className="flex justify-between">
                    <p className="font-bold text-lg">
                        {listing.name} - $
                        {listing.offer ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </p>
                    <div className="flex justify-end gap-2 m-2 cursor-pointer" onClick={() => {
                        navigator.clipboard.writeText(window.location.href)
                        setShareLinkCopied(true)
                        setTimeout(() => {
                            setShareLinkCopied(false)
                        }, 2000)
                    }}>
                        <FaShareNodes className="bg-white rounded-md text-3xl p-1" />
                        <div className="flex justify-end">
                            {shareLinkCopied && <p className="bg-white text-sm rounded-md p-1">Link Copied!</p>}
                        </div>
                    </div>

                </div>

                <p className="font-bold text-base">{listing.location}</p>
                <div className="flex gap-2 mt-2">
                    <p className="text-white bg-accent rounded-xl p-1 text-sm">{listing.tpe === 'rent' ? 'For Rent' : 'For Sale'}</p>
                    {listing.offer && (
                        <p className="bg-black p-1 rounded-xl text-white text-sm">
                            ${listing.regularPrice - listing.discountedPrice}      Discount
                        </p>
                    )}
                </div>

                <ul>
                    <li>
                        {listing.bedrooms > 1 ? `${listing.bedrooms}
                    Bedrooms` : '1 Bedroom'}
                    </li>
                    <li>
                        {listing.bathrooms > 1 ? `${listing.bathrooms}
                    Bathrooms` : '1 Bathroom'}
                    </li>
                    <li>{listing.parking && 'Parking Spot'}</li>
                    <li>{listing.parking && 'Furnished'}</li>
                </ul>

                <p className="font-bold text-md mt-5">Location</p>

                <div className="w-full h-52 overflow-x-hidden">
                    <MapContainer style={{ height: '100%', width: '100%' }}
                        center={[listing.geolocation.lat, listing.geolocation.lng]}
                        zoom={13} scrollWheelZoom={false}>

                        <TileLayer
                            attribution='&copy; <a href="http:osm.org/
                            copyright">OpenStreetMap</a> contributors'
                            url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                        />

                        <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>

                            <Popup>{listing.location}</Popup>
                        </Marker>

                    </MapContainer>
                </div>

                <div className="flex justify-center">
                    <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className="bg-accent rounded-lg flex justify-center p-2 w-1/2 text-white mt-5">
                        Contact Landlord
                    </Link>
                </div>

            </div>
        </main >
    )
}

export default Listing