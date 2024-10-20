import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Home from './pages/Home';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <Home />
  </IonApp>
);

export default App;