import React from 'react'
import Hero from '../../../components/hero'
import performance from '../../../../public/performance.jpg' // Adjust the path as necessary

const page = () => {
  return (
    <div>
      <Hero
        imgUrl={performance}
        altText="Performance Image"
        content="Optimize your application's performance"
      />
    </div>
  )
}

export default page