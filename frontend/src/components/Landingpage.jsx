import Navbar from './Navbar.jsx'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import './Landingpage.css'

function Landingpage() {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      <Navbar openLoginModal={showLogin} />
      
      <header className="w-full px-6 py-6 lg:px-12 flex justify-between items-center bg-transparent z-10">
        <div className="flex items-center">
          <Link to="/" className="text-3xl font-bold tracking-tight text-slate-900">Thrifty</Link>
        </div>
        <nav className="flex items-center space-x-8">
          <button 
            className="text-sm font-medium hover:text-brand transition-colors duration-200" 
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <Link 
            className="bg-brand text-white px-6 py-2.5 rounded-custom text-sm font-medium hover:bg-brand-dark transition-all duration-300 shadow-sm hover:shadow-md" 
            to="/signup"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="min-h-[80vh] flex flex-col items-center justify-center relative px-6 text-center">
          <div className="hero-glow"></div>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 mb-4">
                Thrifty
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 italic">
                Swipe. Save. Discover thrift gems.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-slate-500 leading-relaxed">
                Thrifty turns thrifting into a simple swipe experience. Browse a personalized feed of secondhand gems, swipe right to save, left to skip, and discover amazing deals—all in one smooth experience.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-6 pt-4">
              <Link to="/signup" className="bg-brand text-white px-10 py-4 rounded-custom text-lg font-semibold hover:bg-brand-dark transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Start thrifting
              </Link>
              <Link to="/dashboard" className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-4 decoration-slate-300 hover:decoration-brand">
                Browse as guest →
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 lg:px-12 bg-white/40 backdrop-blur-sm border-y border-slate-200/50">
          <div className="max-w-5xl mx-auto text-center">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-brand/10 text-brand">
                  <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Curated Discovery</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  An algorithm that learns your style.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-brand/10 text-brand">
                  <span className="material-symbols-outlined text-2xl">favorite</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Saved & Organized</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Build your dream wishlist.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-brand/10 text-brand">
                  <span className="material-symbols-outlined text-2xl">eco</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Sustainable Selling</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Give clothes a second life.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-brand/10 text-brand">
                  <span className="material-symbols-outlined text-2xl">local_shipping</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Fast Delivery</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Reliable shipping.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">Experience the Swipe</h2>
              <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
                We've reimagined fashion discovery. No more endless scrolling through cluttered lists. Just simple, intuitive swipes that learn what you love.
              </p>
              <div className="flex gap-3 items-center text-brand font-semibold">
                <span className="material-symbols-outlined text-2xl">touch_app</span>
                <span>Swipe right to save, left to pass.</span>
              </div>
            </div>
            <div className="lg:w-1/2 relative h-[450px] w-full flex items-center justify-center swipe-card-stack">
              <div className="absolute w-[300px] h-[400px] bg-white rounded-3xl shadow-xl border border-slate-100 p-2 transform rotate-6 translate-x-12 translate-y-4 opacity-40 swipe-card">
                <div className="w-full h-full bg-slate-100 rounded-2xl overflow-hidden">
                  <img alt="preview" className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCic0M1VQBY-vvQ3v9r43XdTsPNv6_erKUgJzq1bZVQu9zY0rG_F-sb_4OMx5A1T39NF2OQoNqoZ3x2j1H5P075C2qw8soSGa0sHdCP9UHSXERcV8dOX2i2GPXfuFf44l-7BRes0reRgKFRcJA7t1pHk3X9xf1eGQhkBs0lR5sN0TPzYkLuw5Lnk97Q71ws5kOAjMhTyxNNUZQtfTOdPmGPSkFZ1ni-ULgu15_1EijSZJYcQi2CFgXrfRs3xV3uqLxUzHV17QsawUw"/>
                </div>
              </div>
              <div className="absolute w-[300px] h-[400px] bg-white rounded-3xl shadow-xl border border-slate-100 p-2 transform -rotate-3 -translate-x-6 translate-y-2 opacity-70 swipe-card">
                <div className="w-full h-full bg-slate-100 rounded-2xl overflow-hidden">
                  <img alt="preview" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1m_fNJoMWs3Q66mlrZBRRcU6WDtaqeWcIpIJiQXxsdXhLXqB0zxbHSzeS7U_t8zzqGNt7WoDdsb7ekZLf7JXh8vWjuo-BbunYh10qqDCwd3TNDUIiI9zcL3UcPVSCyhfPLoap2pQpXg9P7MJaGwTZ1XKXJuyOwQTzJlyGTxSrBjtUXuymtJCRz0Itja60QHLU7jOG1K9BhJGUJzWzY_T9Ja2mX879xEaFcfYFqFoOuw2fidItAh0njx2HGsUVCAmV7b2PAFFpH4k"/>
                </div>
              </div>
              <div className="relative w-[320px] h-[440px] bg-white rounded-[32px] shadow-2xl border border-slate-100 p-3 z-10 swipe-card">
                <div className="relative h-full rounded-[24px] overflow-hidden group">
                  <img alt="Vintage Denim Jacket" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0stnqrZ5PS8mrmVVgU1OxBtO3CeYvzzeWJ7GminujmAVfQRX5wf0HUf7qG3-Y49MPLM_QdZC8gba8cIzs9cdAy_Z5hbv1PTyh0CTu6mheh9EXyovxJfHq6AiWC_kxGyQmaxG2l0kwMgo6vVmGM68Bxn7vU2HIwABF1Nqg5Er5wgVjGBW8hML5IEKZwhza_pf6b7mk8QfhBHFfxQsdFqUERjynhMkYGpb5MB5fxX2w34i9nC-0IWgs8PDbeRHZ6IYXziHW_sYoMvI"/>
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-tight">Vintage Denim Jacket</h4>
                          <p className="text-[10px] text-slate-500">Pre-loved • Excellent</p>
                        </div>
                        <span className="font-bold text-brand text-sm">₱45.00</span>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">M</span>
                        <span className="text-[10px] font-medium text-slate-600 truncate">TheThriftStore_PH</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                    <button className="w-12 h-12 rounded-full bg-white text-slate-400 shadow-lg border border-slate-100 flex items-center justify-center hover:text-red-500 hover:scale-110 transition-all duration-200">
                      <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                    <button className="w-14 h-14 rounded-full bg-brand text-white shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-200">
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </button>
                    <button className="w-12 h-12 rounded-full bg-white text-slate-400 shadow-lg border border-slate-100 flex items-center justify-center hover:text-brand hover:scale-110 transition-all duration-200">
                      <span className="material-symbols-outlined text-2xl">shopping_bag</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 text-center text-xs text-slate-400">
        <p>© 2024 Thrifty Marketplace. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Landingpage;
