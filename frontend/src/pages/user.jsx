import { Link } from "react-router-dom";
import PlatformName from "../components/PlatformName";
import "./user.css";

export default function UserHome() {
  return (
    <>
        <nav className='navbar'>
          <div className='nav-container'>
            <div className='logo'>
              <PlatformName />
            </div>

            <div className='parts'>
              <Link to='#'>Home</Link>
            </div>

            <div className='buttons'>
              <div>M</div>
              <div>
                <h2>PlayerName</h2>
                <p>Category</p>
              </div>
            </div>
          </div>
        </nav>
      
    </>
  );
}
