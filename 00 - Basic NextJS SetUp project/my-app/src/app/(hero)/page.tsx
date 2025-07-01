import React from 'react'
import Hero from '../../components/hero'
import home from '../../../public/home.jpg' // Adjust the path as necessary

const page = () => {
  return (
    <div>
      <Hero
        imgUrl={home}
        altText="Home Image"
        content="Welcome to the Home Page"
      />
    </div>
  )
}

export default page
