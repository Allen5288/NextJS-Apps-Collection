import React from 'react'
import Hero from '../../../components/hero'
import reliability from '../../../../public/reliability.jpg' // Adjust the path as necessary

const page = () => {
  return (
    <div>
      <Hero
        imgUrl={reliability}
        altText="Reliability Image"
        content="Ensure your application’s reliability"
      />
    </div>
  )
}

export default page