import React from 'react'

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100">
      <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold line-clamp-2 min-h-[2.5rem]">{product.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 min-h-[2rem] mt-1">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="text-lg font-bold">${product.price}</div>
          {typeof product.rating === 'number' && (
            <div className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">{product.rating.toFixed(1)} ★</div>
          )}
        </div>
        <button onClick={() => onAdd?.(product)} className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg">
          Add to cart
        </button>
      </div>
    </div>
  )
}
