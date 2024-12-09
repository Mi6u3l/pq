import { Link, useLocation } from "react-router-dom";

function Navigation() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const linkClass = (path: string) => 
        `text-white hover:text-yellow-400 transition-colors font-medium text-lg ${
            isActive(path) ? "text-yellow-400" : ""
        }`;

    return (
        <nav className="bg-slate-800 p-4 shadow-md" aria-label="Main">
            <div className="container mx-auto flex items-center justify-center gap-6">
                <ul className="flex gap-6 list-none" role="menubar">
                    <li role="none">
                        <Link 
                            to="/" 
                            className={linkClass("/")}
                            role="menuitem"
                            aria-current={isActive("/") ? "page" : undefined}
                        >
                            Pokémon List
                        </Link>
                    </li>
                    <li role="none">
                        <Link 
                            to="/pokedex" 
                            className={linkClass("/pokedex")}
                            role="menuitem"
                            aria-current={isActive("/pokedex") ? "page" : undefined}
                        >
                            Pokédex
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navigation;