import { useState } from "react";
import firebase from "./utils/Firebase";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Auth from './pages/Auth';
import { toast, ToastContainer } from 'react-toastify'

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const auth = getAuth();

  onAuthStateChanged(auth, (currentUser) => {
    console.log("🚀 ~ file: App.js ~ line 14 ~ onAuthStateChanged ~ currentUser", currentUser)
    if (!currentUser?.emailVerified) {
      signOut(auth);
      setUser(null);
    } else {
      setUser(currentUser);
    }
    setIsLoading(false);
  });

  if (isLoading) {
    return null;
  }

  return (
    <>
      {!user ? <Auth/> : <UserLogged/>}
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl={false} draggable pauseOnHover={false}/>
    </>
  )
}

function UserLogged() {

  const auth = getAuth();

  const logout = () => {
     signOut(auth).catch(() => toast.error("Error cerrando la sesion"));
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <h1>Usuario Logueado</h1>
      <button onClick={logout}>Cerrar Sesion</button>
    </div>
  );
}

export default App;
