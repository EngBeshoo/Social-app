import React from 'react'
import DropDownComment from '../componets/DropDown/DropDownComment'
import { useAuth } from '../context/AuthContext'

export default function CommentPosts({ comment, onCommentDeleted }) {
    const { userData } = useAuth()
    const avatarUrl = `https://i.pravatar.cc/150?img=${comment.id % 70 || 1}`
    
    const isOwner = userData?.id === comment?.userId || userData?.email === comment?.email

    return (
        <div className="w-full border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-start gap-3">
                <img 
                    className="rounded-full w-10 h-10 object-cover border-2 border-gray-200 flex-shrink-0" 
                    src={avatarUrl}
                    alt={comment?.name || 'User'}
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                            {comment?.name || 'User'} 
                        </h3>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                            {comment.email || 'user@example.com'}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 break-words">
                        {comment.body}
                    </p>
                </div>
                
                {isOwner && (
                    <DropDownComment 
                        commentId={comment?.id} 
                        onCommentDeleted={onCommentDeleted}
                    />
                )}
            </div>
        </div>
    )
}