import Layout from "./components/Layout";
import Hero from "./components/Hero";
import CoffeeForm from "./components/CoffeeForm";
import Stats from "./components/Stats";
import History from "./components/History";
import { useAuth } from "./context/AuthContext";
function App() {

  const {globalUser, isLoading, globalData} = useAuth();
  const isAuthenticated = globalUser;
  const isData = globalData && !!Object.keys(globalData || {}).length; //!! forcefully converst to bool

  //for signed user
  const authenticatedConent = (
    <>
    <Stats/>
    <History/>
    </>
  )

  return (
    <Layout>
      <Hero/>
      <CoffeeForm isAuthenticated={isAuthenticated}/>
      { isAuthenticated && isLoading && <p>Loading...</p>}
      {/* conditonal rendering */}
      {(isAuthenticated && isData)  && (authenticatedConent)} 
    </Layout>
  )
}

export default App
