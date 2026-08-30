// services/commentApi.js
import axios from "axios";

// جلب تعليقات بوست معين
export async function getComment(postId) {
    try {
        const { data } = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        return data
    } catch (error) {
        console.error('Error fetching comments:', error)
        return []
    }
}

// إضافة تعليق جديد
export async function createComment(postId, commentData) {
    try {
        const response = await axios.post(
            'https://jsonplaceholder.typicode.com/comments',
            {
                postId: postId,
                name: commentData.name || 'User',
                email: commentData.email || 'user@example.com',
                body: commentData.body
            }
        )
        return response.data
    } catch (error) {
        console.error('Error creating comment:', error)
        return null
    }
}

// ✅ حذف تعليق
export async function deleteComment(commentId) {
    try {
        // حذف من localStorage أولاً
        const savedComments = JSON.parse(localStorage.getItem('user_comments') || '[]')
        const filteredComments = savedComments.filter(c => c.id !== Number(commentId))
        localStorage.setItem('user_comments', JSON.stringify(filteredComments))

        // محاولة الحذف من الـ API
        try {
            await axios.delete(`https://jsonplaceholder.typicode.com/comments/${commentId}`)
            return true
        } catch (apiError) {
            console.log('API error (using local data only):', apiError)
            return true
        }
    } catch (error) {
        console.error('Error deleting comment:', error)
        return false
    }
}

// تحديث تعليق
export async function updateComment(commentId, commentData) {
    try {
        const response = await axios.put(
            `https://jsonplaceholder.typicode.com/comments/${commentId}`,
            {
                name: commentData.name,
                email: commentData.email,
                body: commentData.body
            }
        )
        return response.data
    } catch (error) {
        console.error('Error updating comment:', error)
        return null
    }
}