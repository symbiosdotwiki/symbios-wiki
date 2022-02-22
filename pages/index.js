import Head from 'next/head'
// import Poprt from 'next/image'
// import styles from '../styles/Home.module.css'

import Portfolio from '../components/Portfolio'

import { getAllPosts } from '../utils'
 
export default function Home({ allPosts }) {
  // const heroPost = allPosts[0]
  // const morePosts = allPosts.slice(1)
  // console.log(allPosts)
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono&display=optional"
          rel="stylesheet"
        />
      </Head>
      <Portfolio {...allPosts}/>
    </>
  )
}


export async function getStaticProps() {
let allPosts = getAllPosts()
return {
    props: { 'allPosts': allPosts },
  }

}