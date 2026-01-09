import React from 'react'
import NavBar from '../components/navBar.jsx'
import Footer from '../components/footer.jsx'
import Categorie from '../components/Categories.jsx'

const Categories = () => {
  return (
       <div class="flex flex-col min-h-screen">
  <header>
    <NavBar />
  </header>
  <main class="flex-grow">
    <Categorie />
  </main>
  <footer>
    <Footer />
  </footer>
</div>
  )
}

export default Categories