import Head from "next/head"
import Link from "next/link"
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
        <title>SYMBIOS.WIKI</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />

        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1"/>

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <meta name="msapplication-TileColor" content="#da532c"/>

        <meta property="og:image" content="/og.jpg" />

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