import { Button } from '@heroui/react'
import React, { useState } from 'react'
import { createPost } from '../services/postApi'
import { useNavigate } from 'react-router-dom'

export default function CreatePost({ onPostCreated }) { 
    const navigate = useNavigate()
    const [postTitle, setPostTitle] = useState('') 
    const [image, setImage] = useState(null)
    const [imageURL, setImageURL] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function addPost(e) {
        e.preventDefault()

        if (!postTitle.trim()) {
            setError('Please enter a post')
            return
        }

        setLoading(true)
        setError('')

        try {
            const postData = {
                title: postTitle,
                body: postTitle, 
                userId: 1 
            }

            const response = await createPost(postData)
            console.log('Post created:', response)

            if (response) {
                
                setPostTitle('')
                setImage(null)
                setImageURL('')
                
               
                if (onPostCreated) {
                    await onPostCreated() 
                }
                
                navigate('/home')
            } else {
                setError('Failed to create post. Please try again.')
            }
        } catch (error) {
            console.error('Error creating post:', error)
            setError('An error occurred while creating the post')
        } finally {
            setLoading(false)
        }
    }

    function handleImage(e) {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setImageURL(URL.createObjectURL(file))
            e.target.value = ''
        }
    }

    function removeImage() {
        setImage(null)
        setImageURL('')
    }

    return (
        <form onSubmit={addPost}>
            <div className="editor mx-auto bg-white w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-4xl rounded-2xl">
                
                <h2 className="text-2xl text-center font-bold text-gray-800 mb-4">
                     Create New Post
                </h2>

                <input 
                    className="bg-gray-100 border border-gray-300 p-3 mb-4 outline-none rounded-lg text-lg"
                    spellCheck="false" 
                    placeholder="What's on your mind?..." 
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                />

                {imageURL && (
                    <div className='relative mb-4'>
                        <img 
                            className="w-full max-h-96 object-cover rounded-lg" 
                            src={imageURL} 
                            alt="PostImage" 
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </button>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-4">
                        ❌ {error}
                    </div>
                )}

                <input 
                    onChange={handleImage} 
                    id='uploadPhoto' 
                    type="file" 
                    className='hidden' 
                    accept="image/*"
                />
                
                <div className="icons flex text-gray-500 m-2">
                    <svg className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    
                    <svg className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    
                    <label htmlFor="uploadPhoto" className="cursor-pointer">
                        <svg className="mr-2 hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </label>
                </div>

                <div className="buttons flex gap-2">
                    <Button 
                        type='submit' 
                        color='primary' 
                        className="flex-1"
                        isLoading={loading}
                        disabled={loading}
                    >
                        {loading ? 'Publishing...' : '📝 Post'}
                    </Button>
                    
                    <Button 
                        type='button'
                        variant="light"
                        onClick={() => navigate('/')}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </form>
    )
}