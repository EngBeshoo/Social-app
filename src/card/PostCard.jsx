// في PostCard.jsx
import React, { useEffect, useState } from 'react'
import { getComment, createComment as createCommentAPI } from '../services/commentApi'
import CommentPosts from './CommentPosts'
import { Link } from 'react-router-dom'
import { Button, Input } from '@heroui/react'
import { useAuth } from '../context/AuthContext'
import DropDown from '../componets/DropDown/DropDown'

export default function PostCard({post}) {
    const { userData, getUserName, getUserAvatar } = useAuth()
    const avatarUrl = `https://i.pravatar.cc/150?img=${post.id % 70 || 1}`
    const [showComment, setShowComment] = useState(false)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)
    const [commentContent, setCommentContent] = useState('')
    const [submitting, setSubmitting] = useState(false)

    console.log('User Name:', getUserName())
    

   
    async function getComments() {
        if (!post?.id) return
        
        setLoading(true)
        try {
            const data = await getComment(post.id)
            console.log(`Comments for post ${post.id}:`, data)
            setComments(data || []) 
        } catch (error) {
            console.error('Error fetching comments:', error)
            setComments([])
        } finally {
            setLoading(false)
        }
    }

   
    function handleCommentDeleted() {
        getComments() 
    }

    async function handleCreateComment(e) {
        e.preventDefault()
        
        if (!commentContent.trim()) {
            console.log('Comment cannot be empty')
            return
        }

        setSubmitting(true)
        try {
            const response = await createCommentAPI(post.id, {
                name: getUserName(),
                email: userData?.email || 'user@example.com',
                body: commentContent
            })
            
            console.log('Comment added:', response)
            
            if (response) {
                setComments([response, ...comments])
                setCommentContent('')
            }
        } catch (error) {
            console.error('Error adding comment:', error)
        } finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        getComments()
    }, [post?.id]) 

    function toggleComments() {
        setShowComment(!showComment)
    }

    const isOwner = userData?.id === post?.userId || userData?.userId === post?.userId
    const userAvatar = getUserAvatar()

    return (
        <div className="w-full flex flex-col px-3 py-3 lg:px-10">
            <div className="w-4/6 mx-auto">
                <div className="bg-white w-full rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-auto py-3 px-4 my-4 border border-gray-100">
                    <div className="w-full h-16 items-center flex justify-between">
                        <div className="flex items-center">
                            <img 
                                className="rounded-full w-12 h-12 mr-3 object-cover border-2 border-gray-200 hover:border-blue-400 transition-colors" 
                                src={avatarUrl}
                                alt="avatar" 
                            />
                            <div>    
                                <h3 className="text-md font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                                    {post.title.split(' ').slice(0,2).join(' ') || 'User'}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-gray-500">📅 created at</p>
                                    <span className="text-xs text-gray-300">•</span>
                                    <p className="text-xs text-blue-500 font-medium">5 min ago</p>
                                </div>
                            </div>
                        </div>
                        
                        <DropDown post={post} />
                    </div>

                    <div className="my-3 px-1">
                        <p className="text-gray-700 leading-relaxed text-base">
                            {post.body}
                        </p>
                    </div>
                    
                    {post.image && (
                        <div className="my-3 rounded-xl overflow-hidden">
                            <img 
                                src={post.image} 
                                alt="post" 
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    )}

                    <div className="w-full flex items-center px-3 my-3">
                        <div className="flex items-center">
                            <div className="bg-blue-500 z-10 w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                                <svg className="w-3 h-3 fill-current text-white" xmlns="http://www.w3.org/2000/svg" width={27} height={27} viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth={2} strokeLinecap="square" strokeLinejoin="round">
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                </svg>
                            </div>
                            <div className="bg-red-500 w-6 h-6 rounded-full flex items-center justify-center -ml-1 shadow-md hover:shadow-lg transition-shadow">
                                <svg className="w-3 h-3 fill-current stroke-current text-white" xmlns="http://www.w3.org/2000/svg" width={27} height={27} viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth={2} strokeLinecap="square" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </div>
                        </div>
                        
                        <div className="w-full flex justify-between ml-3">
                            <p className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                                ❤️ 8 likes
                            </p>
                            <Link to={`/singlepost/${post?.id}`}> 
                                <p 
                                    className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                                    onClick={toggleComments}
                                >
                                    💬 {comments.length} comments
                                </p>
                            </Link>
                            <p className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                                🔄 2 shares
                            </p>
                        </div>
                    </div>
                    
                    <hr className="my-2 border-gray-200" />
                    
                    <div className="w-full mb-3">
                        <form onSubmit={handleCreateComment} className='flex gap-2 items-center'>
                            <img 
                                className="rounded-full w-8 h-8 object-cover border-2 border-gray-200 flex-shrink-0" 
                                src={userAvatar}
                                alt="Your avatar"
                            />
                            <Input 
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)} 
                                placeholder={`Write a comment as ${getUserName()}...`} 
                                variant='bordered'
                                className="flex-1"
                                disabled={submitting}
                            />
                            <Button 
                                type='submit' 
                                color='primary'
                                isLoading={submitting}
                                disabled={!commentContent.trim() || submitting}
                            >
                                {submitting ? 'Adding...' : 'Add'}
                            </Button>
                        </form>
                    </div>

                    <div className="grid grid-cols-3 w-full px-5 my-2 gap-2">
                        <button className="flex flex-row justify-center items-center w-full space-x-2 py-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 group">
                            <svg className="group-hover:text-blue-500 transition-colors" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#838383" strokeWidth={2} strokeLinecap="square" strokeLinejoin="round">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                            </svg>
                            <span className="font-semibold text-md text-gray-600 group-hover:text-blue-500 transition-colors">Like</span>
                        </button>
                        
                        <button 
                            className="flex flex-row justify-center items-center w-full space-x-2 py-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 group"
                            onClick={toggleComments}
                        >
                            <svg className="group-hover:text-green-500 transition-colors" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#838383" strokeWidth={2} strokeLinecap="square" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            <span className="font-semibold text-md text-gray-600 group-hover:text-green-500 transition-colors">Comment</span>
                        </button>
                        
                        <button className="flex flex-row justify-center items-center w-full space-x-2 py-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 group">
                            <svg className="group-hover:text-purple-500 transition-colors" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#838383" strokeWidth={2} strokeLinecap="square" strokeLinejoin="round">
                                <circle cx={18} cy={5} r={3} />
                                <circle cx={6} cy={12} r={3} />
                                <circle cx={18} cy={19} r={3} />
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                            </svg>
                            <span className="font-semibold text-md text-gray-600 group-hover:text-purple-500 transition-colors">Share</span>
                        </button>
                    </div>
                    
                    {showComment && (
                        <div className="mt-4 border-t border-gray-200 pt-4">
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                    <p className="text-gray-500 mt-2">Loading comments...</p>
                                </div>
                            ) : comments.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No comments yet. Be the first! 💬</p>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                    {comments.map((comment) => (
                                        <CommentPosts 
                                            key={comment.id} 
                                            comment={comment}
                                            onCommentDeleted={handleCommentDeleted} // ✅ تمرير callback
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}