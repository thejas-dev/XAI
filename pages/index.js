import Header from '../components/Header'
import Container from '../components/Container'
import Head from 'next/head'
import Image from 'next/image'
import {motion} from 'framer-motion'

const Index = () => {

  return (
    <div className="w-full bg-black" >
      <Head>
        <title>XAI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <motion.div 
      initial={{
        z:50,
        opacity:1
      }}
      whileInView={{
        z:0,
        opacity:0.6
      }}
      transition={{
         duration: 5
      }}
      className="fixed w-full h-full bg-[#1f1f26] bg-[url('https://wallpaperaccess.com/full/3124256.jpg')] bg-center">

      </motion.div>
      <main className="flex mx-auto  w-full max-w-6xl relative min-h-screen">
         
          <Header/>
          <Container/>
      </main>

  </div>
  )
}

export default Index
