import React from 'react'

export default function CommentPosts({comment}) {
    const avatarUrl = `https://i.pravatar.cc/150?img=${comment.id % 70 || 1}`
    
    return (
        <div className="w-full border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-start gap-3">
                <img 
                    className="rounded-full w-10 h-10 object-cover border-2 border-gray-200 flex-shrink-0" 
                    src={avatarUrl}
                    alt={comment.name || 'User'}
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                            {comment.name || 'User'} {/* ← يعرض الاسم */}
                        </h3>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                            {comment.email || 'user@example.com'}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 break-words">
                        {comment.body}
                    </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>
            </div>
        </div>
    )
}