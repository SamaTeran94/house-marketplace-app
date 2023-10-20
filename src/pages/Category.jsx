import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"
import ListingItem from "../components/ListingItem"

const Category = () => {

    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)

    const params = useParams()

    useEffect(() => {
        const fetchListings = async () => {
            try {
                //Get Reference
                const listingsRef = collection(db, 'listings')

                //Create Query
                const q = query(
                    listingsRef,
                    where('type', '==', params.categoryName),
                    orderBy('timestamp', 'desc'),
                    limit(10)
                )

                //Execute query
                const querySnap = await getDocs(q)

                const listings = []

                querySnap.forEach((doc) => {
                    // console.log(doc.data())
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                setListings(listings)
                console.log(listings)
                setLoading(false)
            } catch (error) {
                toast.error('Could not fetch listings')
            }
        }
        fetchListings()
    }, [])

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <div className="w-11/12 mt-5 mb-5" >
                <header className="text-3xl font-black mb-10">
                    <p>{params.categoryName === 'rent' ? 'Places for rent' : 'Places for sale'}</p>
                </header>

                {loading ? <Spinner /> : listings && listings.length > 0 ?
                    <>
                        <main>
                            <ul className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-5">
                                {listings.map((listing) => (
                                    <ListingItem listing={listing.data} key={listing.id} id={listing.id} />
                                ))}
                            </ul>
                        </main>
                    </>
                    : <p>No listings for {params.categoryName}</p>}
            </div>
        </div>
    )
}

export default Category
