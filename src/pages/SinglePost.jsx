import React, { useEffect, useState } from 'react'
import { getSinglePosts } from '../services/postApi'
import { getComment, createComment } from '../services/commentApi' // ← استورد createComment
import { useParams, Link } from 'react-router-dom'
import Loading from '../componets/Loading/Loading'

export default function SinglePost() {
    let { id } = useParams()
    let [postDetails, setPostDetails] = useState(null)
    let [comments, setComments] = useState([])
    let [loading, setLoading] = useState(true)
    let [error, setError] = useState('')
 
    let [newComment, setNewComment] = useState({
        name: '',
        email: '',
        body: ''
    })
    let [submitting, setSubmitting] = useState(false)
    let [commentError, setCommentError] = useState('')

    async function getPostDetails() {
        setLoading(true)
        setError('')
        try {
            const post = await getSinglePosts(id)
            console.log('Post:', post)
            
            if (post && post.id) {
                setPostDetails(post)
                const commentsData = await getComment(id)
                setComments(commentsData || [])
                console.log('Comments:', commentsData)
            } else {
                setError('Post not found')
            }
        } catch (error) {
            console.error('Error fetching post:', error)
            setError('Failed to load post')
        } finally {
            setLoading(false)
        }
    }

   
    async function handleCreateComment(e) {
        e.preventDefault()
        
    
        if (!newComment.body.trim()) {
            setCommentError('Comment text is required')
            return
        }

        setSubmitting(true)
        setCommentError('')
        
        try {
            const response = await createComment(id, {
                name: newComment.name || 'Anonymous',
                email: newComment.email || 'user@example.com',
                body: newComment.body
            })
            
            console.log('Comment created:', response)
            
            if (response) {
               
                setComments([response, ...comments])
               
                setNewComment({
                    name: '',
                    email: '',
                    body: ''
                })
               
                alert('Comment added successfully! 🎉')
            } else {
                setCommentError('Failed to add comment. Please try again.')
            }
        } catch (error) {
            console.error('Error creating comment:', error)
            setCommentError('An error occurred while adding comment')
        } finally {
            setSubmitting(false)
        }
    }

   
    function handleCommentChange(e) {
        setNewComment({
            ...newComment,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if (id) {
            getPostDetails()
        }
    }, [id])

    if (loading) return <Loading />
    
    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-center">
                    <p className="text-2xl text-red-500">❌ {error}</p>
                    <Link to="/" className="mt-4 inline-block text-blue-500 hover:underline">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        )
    }

    if (!postDetails) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <p className="text-xl text-gray-500">No post found</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-300 py-8">
            <div className="container mx-auto max-w-4xl px-4">
                <Link to="/home" className="bg-white rounded-2xl p-1 hover:bg-sky-600 hover:text-white duration-200 inline-flex items-center text-blue-500 mb-6">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>

                
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <div className="flex items-center mb-6">
                        <img 
                            className="rounded-full w-14 h-14 mr-4 object-cover border-2 border-gray-200" 
                            src={`https://i.pravatar.cc/150?img=${postDetails.id % 70}`}
                            alt="avatar"
                        />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                User {postDetails.userId}
                            </h3>
                            <p className="text-sm text-gray-400">📅 Posted 5 minutes ago</p>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {postDetails.title}
                    </h1>
                    
                    <p className="text-gray-700 leading-relaxed text-lg">
                        {postDetails.body}
                    </p>

                    <div className="mt-6 flex items-center gap-6 text-gray-500">
                        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>Like (8)</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>Comments ({comments.length})</span>
                        </button>
                    </div>
                </div>

          
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        💬 Comments ({comments.length})
                    </h2>

                    <div className="bg-white rounded-xl shadow p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add a Comment</h3>
                        
                        {commentError && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                                {commentError}
                            </div>
                        )}

                        <form onSubmit={handleCreateComment}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                            </div>
                            
                            <div className="flex gap-3">
                                <textarea
                                    name="body"
                                    value={newComment.body}
                                    onChange={handleCommentChange}
                                    placeholder="Write your comment here..."
                                    rows="3"
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-fit"
                                >
                                    {submitting ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Posting...
                                        </span>
                                    ) : (
                                        'Post Comment'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                 
                    {comments.length === 0 ? (
                        <div className="bg-white rounded-xl shadow p-6 text-center">
                            <p className="text-gray-500">No comments yet. Be the first! 💬</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <div key={comment.id} className="bg-white rounded-xl shadow p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <img 
                                            className="rounded-full w-10 h-10 object-cover border-2 border-gray-200 flex-shrink-0" 
                                            src={`https://i.pravatar.cc/150?img=${comment.id % 70 || 1}`}
                                            alt={comment.name}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <h4 className="font-semibold text-gray-800">
                                                    {comment.name}
                                                </h4>
                                                <span className="text-xs text-gray-400">
                                                    {comment.email}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mt-2">
                                                {comment.body}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}