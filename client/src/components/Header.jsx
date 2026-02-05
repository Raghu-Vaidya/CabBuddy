import logo from "../assets/logo.svg"
import { Link, NavLink, useNavigate, } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Search, PlusCircle, LogOut, User } from "lucide-react";
import LoginSignupDialog from "./LoginSignupDialog";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import axios from "axios";
const apiUri = import.meta.env.VITE_REACT_API_URI


const Header = () => {
  const { user, dispatch } = useContext(AuthContext)
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${apiUri}/auth/logout`, { withCredentials: true });
      dispatch({ type: 'LOGOUT' });
      navigate("/");
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 mx-auto flex p-3 lg:px-16 items-center justify-end transition-all duration-300">
      <NavLink to="/" className="inline-flex -order-1 items-center gap-2 group">
        <img src={logo} width={38} alt="CabBuddy" className="group-hover:scale-110 transition-transform duration-300" />
        <h1 className="font-bold text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent hidden sm:block">CabBuddy</h1>
      </NavLink>
      <nav className="ml-auto flex items-center text-sm font-medium justify-center">
        <NavLink to="/search" className={({ isActive }) => `flex items-center gap-2 mr-6 transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
          <Search className="h-4 w-4" />Search
        </NavLink>
        <NavLink to="/offer-seat" className={({ isActive }) => `flex items-center gap-2 mr-6 transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
          <PlusCircle className="h-4 w-4" /> Publish a ride
        </NavLink>
      </nav>
      {!user ?
        <LoginSignupDialog />
        :
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary transition-colors cursor-pointer ring-offset-background">
              <AvatarImage src={user.user.profilePicture} />
              <AvatarFallback className="select-none text-primary text-sm font-bold bg-primary/10">{user.user?.name[0]}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-sm">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex w-full cursor-pointer">
                <User className="mr-2 h-4 w-4" /><span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer text-destructive focus:text-destructive' onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /><span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    </header>
  )
}

export default Header