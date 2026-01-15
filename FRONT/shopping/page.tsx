// app/shopping/page.tsx - Preview
<div style={pinkGradientBackground}>
  <h1>🎁 Your Personal Shopping Mall</h1>
  
  {/* Shopping Intent Form */}
  <div style={cardStyle}>
    <h3>What are you looking for today?</h3>
    <select>Category: Tops, Dresses, etc.</select>
    <select>Occasion: Casual, Formal, Party</select>
    <input type="range">Budget: ₹500 - ₹5000</input>
    <checkbox>Myntra</checkbox>
    <checkbox>Amazon</checkbox>
    <button>✨ Find Perfect Items</button>
  </div>
  
  {/* Product Grid */}
  <div style={gridStyle}>
    {products.map(product => (
      <div style={productCard}>
        <img src={product.image} />
        <h4>{product.title}</h4>
        <p>₹{product.price}</p>
        <p>{product.store}</p>
        <button>🤔 Why this matches me?</button>
        <button>❤️ Save</button>
      </div>
    ))}
  </div>
</div>