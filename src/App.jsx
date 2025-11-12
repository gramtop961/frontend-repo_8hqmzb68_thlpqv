import { useEffect, useMemo, useState } from 'react'
import ProductCard from './components/ProductCard'

const BACKEND = import.meta.env.VITE_BACKEND_URL

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart])

  useEffect(() => {
    const init = async () => {
      try {
        // Seed sample products if collection is empty
        await fetch(`${BACKEND}/api/seed`, { method: 'POST' })
      } catch {}
      try {
        const res = await fetch(`${BACKEND}/api/categories`)
        const data = await res.json()
        setCategories(data.items || [])
      } catch {}
    }
    init()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      setLoading(true)
      try {
        const p = new URLSearchParams()
        if (query) p.set('search', query)
        if (category) p.set('category', category)
        const res = await fetch(`${BACKEND}/api/products?${p.toString()}`, { signal: controller.signal })
        const data = await res.json()
        setItems(data.items || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [query, category])

  const addToCart = (p) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === p.id)
      if (ex) return prev.map((i) => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { id: p.id, title: p.title, price: p.price, qty: 1 }]
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-[#2874F0] text-white px-4 md:px-8 py-3 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="text-2xl font-extrabold tracking-tight">FlipKart Lite</div>
          <div className="flex-1">
            <div className="bg-white rounded-md flex items-center gap-2 px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-gray-400"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search for products" className="w-full outline-none text-sm text-gray-800 placeholder:text-gray-400" />
            </div>
          </div>
          <div className="ml-auto text-sm font-medium">Cart: {cart.reduce((s,i)=>s+i.qty,0)} items • ${subtotal.toFixed(2)}</div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={()=>setCategory('')} className={`px-3 py-1.5 rounded-full text-sm border ${category===''? 'bg-blue-600 text-white border-blue-600':'bg-white text-gray-700 border-gray-300'}`}>All</button>
          {categories.map((c)=> (
            <button key={c} onClick={()=>setCategory(c)} className={`px-3 py-1.5 rounded-full text-sm border ${category===c? 'bg-blue-600 text-white border-blue-600':'bg-white text-gray-700 border-gray-300'}`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6 pb-24">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({length:8}).map((_,i)=> (
              <div key={i} className="h-64 bg-white rounded-xl border animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500">No products found</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((p)=> (
              <ProductCard key={p.id || p._id} product={p} onAdd={addToCart} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 text-sm text-gray-500 flex flex-wrap gap-2 justify-between">
          <div>FlipKart Lite demo for browsing products</div>
          <div>
            Backend: <span className="font-medium">{BACKEND}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
