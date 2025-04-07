import './App.css'
import { Link } from 'react-router-dom';

function App() {
  return (
    <>
      <h1>OG FOOTBALL</h1>
      <Link to={'/login'}>Login</Link>
    </>
  );
}

export default App
