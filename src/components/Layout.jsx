import { useState } from "react";
import Modal from "./Modal";
import Authentication from "./Authentication";
import { useAuth } from "../context/AuthContext";

export default function Layout(props) {
    const { children } = props;
    const [showModal, setShowModal]=useState(false);
    const {globalUser, logout} = useAuth();
    const header = (
        <header>
            <div>
                <h1 className="text-gradient">CAFFIEN</h1>
                <p>For Coffee Insatiates</p>
            </div>

            {globalUser ? 
                  (<button onClick={logout}>
                  <p>Log out</p>
                  <i className="fa-solid fa-mug-hot"></i>
              </button>):((<button onClick={()=>setShowModal(true)}>
                  <p>Sign up free</p>
                  <i className="fa-solid fa-mug-hot"></i>
              </button>))
              
            }
        </header>
    )

    const footer = (
        <footer>
            <p><span className="text-gradient">Caffein</span> made with ❤️  by <a  className="text-gradient"href="">Kabir Sharma</a></p>
        </footer>
    )

    return(
        <>
        {showModal && (
        <Modal handleCloseModal={() => {
          console.log("Closing modal"); 
          setShowModal(false);
        }}>
          <Authentication handleCloseModal={() => {
            console.log("Closing modal from Authentication"); 
            setShowModal(false);
          }} />
        </Modal>
      )}
        {header}
        <main>
        {children}
        </main>
        {footer}
        </>
    )
}