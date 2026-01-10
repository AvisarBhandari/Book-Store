import React from 'react'
import NavBar from '../components/navBar.jsx'
import Footer from '../components/footer.jsx'
import BestSelling from '../components/BastSelling.jsx'

const bestSelling = () => {
  return (
    <div class="flex flex-col min-h-screen">
  <header>
    <NavBar />
  </header>
  <main class="flex-grow">
    <BestSelling />
  </main>
  <footer>
    <Footer />
  </footer>
</div>
  )
}

export default bestSelling