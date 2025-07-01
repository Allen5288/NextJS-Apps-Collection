import React from 'react'
import Hero from '../../../components/hero'
import scale from '../../../../public/scale.jpg' // Adjust the path as necessary

const page = () => {
  return (
    <div>
      <Hero
        imgUrl={scale}
        altText="Scale Image"
        content="Scale your application effortlessly"
      />
    </div>
  )
}

export default page