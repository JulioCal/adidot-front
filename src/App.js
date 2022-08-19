import "./App.css";
import { Route } from "wouter";
import { DocumentContextProvider } from "./Contexts/DocumentContext";
import { LoginContextProvider } from "./Contexts/CredentialContext";
import { DragDropContext } from "react-beautiful-dnd";
import PrivateDocument from "./components/PrivateComponent/PrivateDocuments";
import DocumentDetail from "./components/DocumentComponent/DocumentDetail";
import EditDocument from "./components/DocumentComponent/EditDocument";
import NewDocument from "./components/DocumentComponent/NewDocument";
import GroupScreen from "./components/GroupComponent/GroupScreen";
import Display from "./components/DisplayComponent/Display";
import UserInfo from "./components/UserComponent/UserInfo";
import Header from "./components/HeaderComponent/Header";
import Footer from "./components/FooterComponent/Footer";
import Login from "./components/LoginComponent/Login";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  // cuerpo principal de la app. aqui se importan los componentes y se renderizan por primera vez.
  return (
    <div className="App">
      <LoginContextProvider>
        <DocumentContextProvider>
          <Header />
          <DragDropContext>
            <section className="App-content">
              <div className="First-segment">
                <Route path="/" component={Display} />
                <Route path="/documents/:id" component={DocumentDetail} />
                <Route path="/documents/:id/edit" component={EditDocument} />
                <Route path="/new-document" component={NewDocument} />
                <Route path="/groups" component={GroupScreen} />
                <Route path="/document-list" component={PrivateDocument} />
                <Route path="/personal-data" component={UserInfo} />
              </div>
              <div className="Second-segment">
                <Login />
              </div>
            </section>
          </DragDropContext>
        </DocumentContextProvider>
        <Footer />
      </LoginContextProvider>
    </div>
  );
}

export default App;
