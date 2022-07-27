import './App.css';
import { Route } from 'wouter';
import { DocumentContextProvider } from './Contexts/DocumentContext';
import {LoginContextProvider} from './Contexts/CredentialContext';
import Header from './components/HeaderComponent/Header';
import Footer from './components/FooterComponent/Footer'
import Display from './components/DisplayComponent/Display';
import DocumentDetail from './components/DocumentComponent/DocumentDetail';
import EditDocument from './components/DocumentComponent/EditDocument';
import NewDocument from './components/DocumentComponent/NewDocument';
import PrivateDocument from './components/PrivateComponent/PrivateDocuments';
import Login from './components/LoginComponent/Login';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // cuerpo principal de la app. aqui se importan los componentes y se renderizan por primera vez.
  return (
    <div className="App">
      <LoginContextProvider>
          <DocumentContextProvider>
          <Header />
          <section className="App-content">
            <div className='First-segment'>
              <Route path='/' component={Display} />
              <Route path='/documents/:id' component={DocumentDetail} />
              <Route path='/documents/:id/edit' component={EditDocument} />
              <Route path='/new-document' component={NewDocument} />
              <Route path='/document-list' component={PrivateDocument} />
              <Route path='/groups' />
              <Route path='/personal-data' />
            </div>
            <div className='Second-segment'>
              <Login />
            </div>
          </section>
          </DocumentContextProvider>
          <Footer />
        </LoginContextProvider>
      </div>
  );
}

export default App;
