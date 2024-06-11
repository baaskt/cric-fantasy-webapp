import { useState, useEffect } from 'react'

const useMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      setIsMobile(screenWidth <= 768) // Adjust this threshold as needed
    }

    // Initial call to set the initial value
    handleResize()

    // Event listener for window resize
    window.addEventListener('resize', handleResize)

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile
}

export default useMobile
