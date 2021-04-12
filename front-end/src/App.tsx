import { Switch, Route } from 'react-router-dom'

import { Home, Navbar } from './components'

function App() {
  return (
    <div>
      <Navbar/>
      <Switch>
        <Route path="/">
          <Home/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
