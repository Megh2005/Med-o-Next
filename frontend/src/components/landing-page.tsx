'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Pill, Stethoscope, ShoppingCart, MessageCircle, Brain, Eye, Sun, Moon } from 'lucide-react'

export function LandingPageComponent() {
const [email, setEmail] = useState('')
const [darkMode, setDarkMode] = useState(false)

useEffect(() => {
  const createStar = () => {
    const star = document.createElement('div')
    star.className = 'star'
    star.style.left = `${Math.random() * 100}vw`
    star.style.top = `${Math.random() * 100}vh`
    star.style.animationDuration = `${Math.random() * 2 + 1}s` // Random duration for each star
    star.style.animationDelay = `${Math.random() * 2}s` // Random delay for each star
    star.style.opacity = Math.random().toString() // Random opacity for twinkling effect
    document.getElementById('starry-background')?.appendChild(star)
  }

  for (let i = 0; i < 200; i++) {
    createStar()
  }

  return () => {
    const stars = document.getElementsByClassName('star')
    while (stars.length > 0) {
      stars[0].parentNode.removeChild(stars[0])
    }
  }
}, [])

const toggleDarkMode = () => {
  setDarkMode(!darkMode)
}

return (
  <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} ${darkMode ? 'text-gray-100' : 'text-gray-900'} relative overflow-hidden transition-colors duration-300`}>
    <div id="starry-background" className={`absolute inset-0 overflow-hidden pointer-events-none ${darkMode ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`} style={{ height: '100vh' }}></div>
    
    <header className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10">
      <div className="flex items-center space-x-2">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 bg-blue-600 rounded-full"></div>
          <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
            <Heart className="h-6 w-6 text-blue-600" />
          </div>
          <div className="absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 bg-green-400 rounded-full"></div>
        </div>
        <span className="text-2xl font-bold">MED-O-NEXT</span>
      </div>
      <nav className="hidden md:flex space-x-6">
        <a href="#features" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-green-500 transition-colors`}>Features</a>
        <a href="#services" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-green-500 transition-colors`}>Services</a>
        <a href="#contact" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-green-500 transition-colors`}>Contact</a>
      </nav>
      <Button
        variant="outline"
        className={`${darkMode ? 'text-gray-300 border-gray-300' : 'text-gray-700 border-gray-700'} hover:bg-green-500 hover:text-white transition-colors`}
        onClick={toggleDarkMode}
      >
        {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </header>

    <main>
      <section className="container mx-auto px-4 py-20 text-center flex-grow relative z-10 "style={{ minHeight: '100vh' }}>
        <h1 className="text-5xl font-bold mb-6">The Extreme Problem Solver of Medical Industry</h1>
        <p className={`text-xl ${darkMode ? 'text-green-400' : 'text-green-600'} mb-8 max-w-2xl mx-auto`}>Revolutionizing healthcare with cutting-edge solutions for patients and professionals alike. Experience the future of medical services today.</p>
        <div className="flex justify-center space-x-4">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white transition-colors">Get Started</Button>
          <Button variant="outline" size="lg" className={`${darkMode ? 'text-gray-300 border-gray-300' : 'text-gray-700 border-gray-700'} hover:bg-green-500 hover:text-white transition-colors`}>Learn More</Button>
        </div>
      </section>

      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Stethoscope className="h-10 w-10 text-green-500" />, title: "Expert Consultations", description: "Connect with top medical professionals for personalized care." },
            { icon: <Pill className="h-10 w-10 text-green-500" />, title: "Medication Management", description: "Easy tracking and reminders for your prescriptions." },
            { icon: <ShoppingCart className="h-10 w-10 text-green-500" />, title: "Medical Supplies", description: "Quick access to essential medical supplies and equipment." }
          ].map((feature, index) => (
            <Card key={index} className={`text-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} transition-all duration-300 hover:scale-105 hover:shadow-lg ${darkMode ? 'hover:shadow-green-400/20' : 'hover:shadow-green-500/20'}`}>
              <CardContent className="pt-6">
                <div className={`mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-green-100'}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={darkMode ? 'text-white' : 'text-gray-600'}>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="services" className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} transition-colors duration-300`} style={{ minHeight: '100vh' }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <MessageCircle className="h-16 w-16 text-green-500 mb-4" />, title: "Med-o-Chat", description: "Multilingual real-time chat platform with doctors from pan India.", action: "Start Chatting" },
              { icon: <ShoppingCart className="h-16 w-16 text-green-500 mb-4" />, title: "Med-o-Shop", description: "Affordable medicines and medical accessories at company-set prices.", action: "Shop Now" },
              { icon: <Brain className="h-16 w-16 text-green-500 mb-4" />, title: "Med-o-AI", description: "AI-powered diagnostics and personalized treatment plans.", action: "Explore AI" },
              { icon: <Eye className="h-16 w-16 text-green-500 mb-4" />, title: "Med-o-Lens", description: "Advanced imaging for precise medical analysis and early detection.", action: "Learn More" }
            ].map((service, index) => (
              <Card key={index} className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} transition-all duration-300 hover:scale-105 hover:shadow-lg ${darkMode ? 'hover:shadow-green-400/20' : 'hover:shadow-green-500/20'}`}>
                <CardContent className="flex flex-col items-center p-6 h-full">
                  {service.icon}
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 text-center`}>{service.description}</p>
                  <Button className="mt-auto bg-green-600 hover:bg-green-700 text-white transition-colors">{service.action}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Stay Updated with MED-O-NEXT</h2>
        <p className={`text-xl ${darkMode ? 'text-green-400' : 'text-green-600'} mb-8 max-w-2xl mx-auto`}>Subscribe to our newsletter for the latest medical innovations and exclusive offers.</p>
        <form onSubmit={(e) => e.preventDefault()} className="flex justify-center max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`flex-grow mr-2 ${darkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} transition-colors`}
          />
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white transition-colors">Subscribe</Button>
        </form>
      </section>
    </main>

    <footer className={`${darkMode ? 'bg-gray-800' : 'bg-gray-200'} py-8 relative z-10 transition-colors duration-300`}>
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} MED-O-NEXT. All rights reserved.</p>
        <div className="mt-4 space-x-4">
          <a href="#" className={`${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} transition-colors`}>Privacy Policy</a>
          <a href="#" className={`${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} transition-colors`}>Terms of Service</a>
          <a href="#" className={`${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} transition-colors`}>Contact Us</a>
        </div>
      </div>
    </footer>

    <style jsx>{`
      @keyframes twinkle {
        0% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0); }
      }

      @keyframes move {
        0% { transform: translateY(0); }
        100% { transform: translateY(-10px); }
      }

      .star {
        position: absolute;
        width: 4px; // Increased size for visibility
        height: 4px; // Increased size for visibility
        background: white;
        border-radius: 50%;
        animation: twinkle 2s infinite, move 5s linear infinite; // Apply twinkle and move animations
        box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.3);
      }

      #starry-background {
        background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
      }
    `}</style>
  </div>
)
}