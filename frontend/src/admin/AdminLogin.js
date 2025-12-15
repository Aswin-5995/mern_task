import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminLogin(){
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const navigate = useNavigate();

  const handleLogin = e => {
    e.preventDefault();
    const creds = [
      {username:"admin",password:"admin123",role:"Admin"},
      {username:"staff",password:"staff123",role:"Staff"}
    ];
    const user = creds.find(u=>u.username===username&&u.password===password);
    if(user){ localStorage.setItem("role",user.role); toast.success("Login"); navigate("/admin/orders"); }
    else toast.error("Invalid");
  }

  return (<form onSubmit={handleLogin}>
    <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
    <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
    <button>Login</button>
  </form>);
}
