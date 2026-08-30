import React, { useEffect, useState } from 'react'
import PostCard from '../card/PostCard'
import { getAllPosts } from '../services/postApi'
import Loading from '../componets/Loading/Loading'
import CreatePost from '../card/CreatePost'

export default function Home() {
    const [allPosts, setAllPosts] = useState([])
    const [loading, setLoading] = useState(true)

    async function getPosts() {
        setLoading(true)
        try {
            const response = await getAllPosts()
            console.log('Posts:', response)
            setAllPosts(response || [])
        } catch (error) {
            console.error('Error fetching posts:', error)
            setAllPosts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getPosts()
    }, []) 

  
    if (loading) {
        return <Loading />
    }

    return (
        <div className="bg-gray-300 min-h-screen">
            <CreatePost onPostCreated={getPosts} /> 
            
            {allPosts.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-600 text-xl">No posts yet. Create one! ✍️</p>
                </div>
            ) : (
                allPosts.map((post) => (
                    <PostCard post={post} key={post.id} />
                ))
            )}
        </div>
    )
}