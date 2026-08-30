import axios from "axios";

export async function getAllPosts(limit = 5, sortBy = 'id', sortOrder = 'desc') {
  try {
    const { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts`, {
      headers: {
        token: localStorage.getItem('token')
      }
    });
    const localPosts = JSON.parse(localStorage.getItem('user_posts') || '[]');

    const allPosts = [...localPosts, ...data];

    const uniquePosts = allPosts.filter((post, index, self) => 
      index === self.findIndex(p => p.id === post.id)
    );

    const sortedPosts = [...uniquePosts].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'id') {
        comparison = a.id - b.id;
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'userId') {
        comparison = a.userId - b.userId;
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    const limitedPosts = sortedPosts.slice(0, limit);

    return limitedPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
   
    const localPosts = JSON.parse(localStorage.getItem('user_posts') || '[]');
    return localPosts.slice(0, limit);
  }
}


export async function getSinglePosts(postId) {
  try {
  
    const localPosts = JSON.parse(localStorage.getItem('user_posts') || '[]');
    const localPost = localPosts.find(p => p.id === Number(postId));
    
    if (localPost) {
      return localPost;
    }

   
    let { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      headers: {
        token: localStorage.getItem('token')
      }
    });
    return data;
  } catch (error) {
    console.error("Error fetching single post:", error);
    return null;
  }
}

export async function createPost(postData) {
  try {
    
    const savedPosts = JSON.parse(localStorage.getItem('user_posts') || '[]');
    
    const newPost = {
      id: Date.now(),  
      title: postData.title,
      body: postData.body || postData.title,
      userId: postData.userId || 1,
      createdAt: new Date().toISOString()
    };
    
    savedPosts.unshift(newPost);
    localStorage.setItem('user_posts', JSON.stringify(savedPosts));

    try {
      const response = await axios.post(
        'https://jsonplaceholder.typicode.com/posts',
        {
          title: postData.title,
          body: postData.body || postData.title,
          userId: postData.userId || 1
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data && response.data.id) {
        const updatedPosts = JSON.parse(localStorage.getItem('user_posts') || '[]');
        const index = updatedPosts.findIndex(p => p.id === newPost.id);
        if (index !== -1) {
          updatedPosts[index].id = response.data.id;
          localStorage.setItem('user_posts', JSON.stringify(updatedPosts));
        }
        return response.data;
      }
      
      return newPost;
    } catch (apiError) {
      console.log('API error (using local data only):', apiError);
      return newPost;
    }
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
}


export async function getSinglePostWithComments(postId) {
  try {
    
    const post = await getSinglePosts(postId);
    
    if (!post) {
      return null;
    }

  
    const commentsResponse = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    
    return {
      post: post,
      comments: commentsResponse.data
    };
  } catch (error) {
    console.error("Error fetching post with comments:", error);
    return null;
  }
}


export async function updatePost(postId, postData) {
  try {
    
    const savedPosts = JSON.parse(localStorage.getItem('user_posts') || '[]');
    const index = savedPosts.findIndex(p => p.id === Number(postId));
    
    if (index !== -1) {
      savedPosts[index] = {
        ...savedPosts[index],
        title: postData.title || savedPosts[index].title,
        body: postData.body || savedPosts[index].body,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('user_posts', JSON.stringify(savedPosts));
    }

   
    try {
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/posts/${postId}`,
        {
          title: postData.title,
          body: postData.body
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (apiError) {
      console.log('API error (using local data only):', apiError);
      return savedPosts[index] || null;
    }
  } catch (error) {
    console.error("Error updating post:", error);
    return null;
  }
}

export async function deletePost(postId) {
  try {
    const savedPosts = JSON.parse(localStorage.getItem('user_posts') || '[]');
    const filteredPosts = savedPosts.filter(p => p.id !== Number(postId));
    localStorage.setItem('user_posts', JSON.stringify(filteredPosts));

    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      return true;
    } catch (apiError) {
      console.log('API error (using local data only):', apiError);
      return true;
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
}

export function clearLocalPosts() {
  localStorage.removeItem('user_posts');
  console.log('Local posts cleared');
}


export async function getPostsCount() {
  try {
    const posts = await getAllPosts(1000); 
    return posts.length;
  } catch (error) {
    console.error("Error getting posts count:", error);
    return 0;
  }
}