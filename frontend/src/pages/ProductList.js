import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const { cart, setCart } = useContext(CartContext);

  useEffect(() => { axios.get("http://localhost:5001/api/products").then(res => setProducts(res.data)); }, []);

  const addToCart = (product) => {
    const exists = cart.find(item => item._id === product._id);
    exists ? setCart(cart.map(item => item._id === product._id ? { ...item, qty: item.qty + 1 } : item)) : setCart([...cart, { ...product, qty: 1 }]);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      <div>
        {filtered.length === 0 ? <p>No products found.</p> : filtered.map(p => (
          <div key={p._id}>
            <img src={p.imageUrl} alt={p.name} />
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
            <span style={{color:p.stock>0?'green':'red'}}>{p.stock>0?'Available':'Out of Stock'}</span>
            <button disabled={p.stock===0} onClick={()=>addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
