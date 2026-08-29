import React, { useEffect, useState } from 'react'
import PostCard from '../card/postCard'
import { getAllPosts } from '../services/postApi'
import Loading from '../componets/Loading/Loading'

export default function Home() {
  let [allPosts ,setallPosts]= useState([])
  async function getPosts(){
    const response = await getAllPosts()
    console.log(response);

      setallPosts(response)
    
    
  }

  useEffect(()=>{
     getPosts()
  })
  return <>

  {allPosts.length > 0 ?   <div className="bg-gray-300">
 {allPosts.map((post)=>{return  <PostCard post={post} key={post.id} /> })}
  </div> : <Loading/> }
  

 

  </>
}
