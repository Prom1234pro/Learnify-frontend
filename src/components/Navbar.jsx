import { useState } from "react"
import logo from "../assets/logo2.png"
import { RiCloseFill, RiMenu3Line} from "@remixicon/react"

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu =  () => {
        setIsOpen(!isOpen)
    }

  return (
  <nav className="fixed top-4 left-0 right-0 z-50 m-2">
    <div className="text-neutral-500 bg-black/60 backdrop-blur-md max-w-7xl mx-auto px-4 py-3 flex justify-between items-center rounded-xl border border-neutral-800">
        {/* Left: logo */}
        <img src={logo} alt="logo" width={210} height={42}/>

        {/* Centre Links (hidden on mobile) */}
         <div className="hidden md:flex space-x-6 text-lg">
            <a href="#" className="hover:text-neutral-200">
                Home
            </a>
            
            <a href="#Features" className="hover:text-neutral-200">
                Features
            </a>

            <a href="#Pricing" className="hover:text-neutral-200">
                Pricing
            </a>


            <a href="#testimonials" className="hover:text-neutral-200">
                Testimonials
            </a>
         </div>

        {/* Right Buttons (hidden on mobile) */}
        <div className="hidden md:flex space-x-4 items-center text-lg">
            <a href="#" className="border border-neutral-700 text-white py-2 px-4 rounded-lg hover:bg-purple-500 transition">
                Sign In
            </a>
            <a href="#" className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 transition">
                Start A Free Trial
            </a>
        </div>

         {/* Hamburger Menu for Mobile*/}
         <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none" aria-label={isOpen ? "Close Menu" : "Open Menu"}>
                {isOpen ? <RiCloseFill/> : <RiMenu3Line/>}
            </button>
         </div>
    </div>

    {/* Mobile Menu*/}
    { isOpen && (
        <div className="md:hidden bg-neutral-900/60 backdrop-blur-md border border-neutral-800 p-4 rounded-xl mt-2">
            <div className="flex flex-col space-y-4">
                <a href="#" className="hover:text-neutral-200">
                    Home
                </a>
                <a href="#" className="hover:text-neutral-200">
                    Features
                </a>
                <a href="#" className="hover:text-neutral-200">
                    Pricing
                </a>
                <a href="#" className="hover:text-white">
                    Testimonials
                </a>
                <a href="#" className="border border-neutral-700 text-white py-2 px-4 rounded-lg hover:bg-purple-500 transition">
                Sign In
                </a>
                <a href="#" className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 transition">
                    Start A Free Trial
                </a>
            </div>
        </div>
    )}
  </nav>
  )
}

export default Navbar