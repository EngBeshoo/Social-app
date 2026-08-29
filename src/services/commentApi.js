import axios from "axios";

export async function getComment(postId) {
    try {
        const { data } = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
        return data
    } catch (error) {
        console.error('Error fetching comments:', error)
        return []
    }
}


export async function getAllComments() {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/comments')
        return response.data
    } catch (error) {
        console.error('Error fetching all comments:', error)
        return []
    }
}


export async function createComment(postId, commentData) {
    try {
        const response = await axios.post(
            `https://jsonplaceholder.typicode.com/comments`,
            {
                postId: postId,
                name: commentData.name || 'User',
                email: commentData.email || 'user@example.com',
                body: commentData.body
            },
            {
                headers: {
                    'Content-Type': 'application/json',

                }
            }
        )
        return response.data
    } catch (error) {
        console.error('Error creating comment:', error)
        return null
    }
}


export async function deleteComment(commentId) {
    try {
        await axios.delete(`https://jsonplaceholder.typicode.com/comments/${commentId}`)
        return true
    } catch (error) {
        console.error('Error deleting comment:', error)
        return false
    }
}


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