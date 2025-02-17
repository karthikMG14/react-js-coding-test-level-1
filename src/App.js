import "./App.css";
import Home from "./Home";
import { Route, NavLink, HashRouter } from "react-router-dom";
import PokeDex from "./PokeDex";
import 'devextreme/dist/css/dx.light.css';


function App() {
  return (
    <HashRouter>
      <div>
        <Route exact path="/" component={Home}/>
        <Route path="/pokedex" component={PokeDex}/>
      </div>
      
    </HashRouter>
  );
}

export default App;
