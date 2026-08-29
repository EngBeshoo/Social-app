import axios from "axios";

export async function getAllPosts() {
  try {
    let { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts`, {
      headers: {
        token: localStorage.getItem('token')
      }
    })
    return data 
  } catch (error) {
    console.error("Error fetching posts:", error)
    return [] 
  }
}

export async function getSinglePosts(postId) {
  try {
    let { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      headers: {
        token: localStorage.getItem('token')
      }
    })
    return data
  } catch (error) {
    console.error("Error fetching single post:", error)
    return null 
  }
}


export async function getSinglePostWithComments(postId) {
  try {
    const [postResponse, commentsResponse] = await Promise.all([
      axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`),
      axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
    ])
    
    return {
      post: postResponse.data,
      comments: commentsResponse.data
    }
  } catch (error) {
    console.error("Error fetching post with comments:", error)
    return null
  }
}