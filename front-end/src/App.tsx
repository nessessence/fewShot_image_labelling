import { Switch, Route } from 'react-router-dom'

import { Home, Navbar, Label, ImageLabel } from './components'

function App() {
  return (
    <div>
      <Navbar/>
      <Switch>
        <Route exact path="/">
          <Home/>
        </Route>
        <Route path="/label/:projectId">
          <Label/>
        </Route>
        <Route path="/image/:imageId">
          <ImageLabel/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
