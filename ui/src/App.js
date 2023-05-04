
import AppWrapper, { Route } from '@xavisoft/app-wrapper'
import './App.css';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Guide from './pages/Guide';

function setDimensions() {
  
  const width = window.innerWidth + 'px';
  const height = window.innerHeight + 'px';

  document.documentElement.style.setProperty('--window-width', width);
  document.documentElement.style.setProperty('--window-height', height);

}

window.addEventListener('resize', setDimensions);
setDimensions();

function App() {
  return (

    <AppWrapper>

      <Navbar />

      <Route path="/" component={Guide} />
      <Route path="/guide" component={Guide} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />

    </AppWrapper>
  );
}

export default App;
