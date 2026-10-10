import {useState} from "react";
import { SubCategorias } from "../Data/NavegaciónData";
import "./Header.css";

export function Header () {
    const [isOpen, setIsOpen] = useState(false); 
    return (
        <header className="site-header">
            <a className="logo" href="../../index.html">
            <img src="public/img/logo.png" alt="logo Buen Origen" height="45" /> 
            </a>
        <nav className="main-nav">
        <div className="nav-group"
                onMouseEnter={() => {setIsOpen(true)}}
                onMouseLeave={() => {setIsOpen(false)}}>
                <a href="/">PRODUCTOS</a>
                    {isOpen&& (
                    <div className="dropdown">
                {SubCategorias.map(function (sub) {
                return (
                    <a key={sub.id} href={sub.link} >{sub.name}</a>
                    );  
                })} 
                </div>
            )}
        </div>

        <a href="/">¿QUIÉNES SOMOS?</a>
        <a href="/">BLOG</a>
        <a href="/">APP</a>
        </nav>

    <div className="header-actions">
        <button className="icon-button">⌕</button>
        <button className="icon-button">♥</button>
        <button className="icon-button user-trigger" aria-label="Mi cuenta">●</button>
        <button className="icon-button cart-trigger">🛒<span className="cart-badge">0</span>
        </button>
    </div>
</header>
)
} 