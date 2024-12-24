//context is anohter hook
//works as global state here
//why not context for all? as it becomes less effective and this is globally available

import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail} from "firebase/auth";
import { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'
const AuthContext= createContext();

export function useAuth(){ //custom hook for destructing values
    return useContext(AuthContext);
}

export function AuthProvider(props){
    const { children } = props;
    const [globalUser, setGlobalUser] = useState(null);
    const [globalData, setGlobalData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    

    function signup(email, password){
        return createUserWithEmailAndPassword(auth, email, password); //firebase function
    }

    function login(email, password){
        return signInWithEmailAndPassword(auth, email, password);
    }
    // async function login(email, password) {
    //     try {
    //         await signInWithEmailAndPassword(auth, email, password);
    //     } catch (error) {
    //         if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
    //             alert('Create an account before logging in!');
    //         } else {
    //             console.error(error);
    //         }
    //     }
    // }
    function resetPassword(email){
        return sendPasswordResetEmail(auth, email);
    }

    function logout(){
        setGlobalUser(null);
        setGlobalData(null);
        return signOut(auth);
    }


    const value = { globalUser, globalData, setGlobalData, isLoading, signup, login, logout }

    useEffect(()=>{ //calback funciton when changes made and array wit hdependency to watch value which chnages
        const unsubscribe = onAuthStateChanged(auth, async(user)=>{
                //if no user, empty user state and return from this listener
                //if user then check if data in db, then fetch and update state
                //(labelled json)
                //console.log(" current user", user);
                setGlobalUser(user);
                if(!user){
                    console.log("no active user");
                    return;
                }
                try {
                    setIsLoading(true);
                    const docRef= doc(db,'users', user.uid);
                    const docSnap = await getDoc(docRef); //imp 
                   let firebaseData={};//init empty, bcuz if nothing it reamins empty!
                   if(docSnap.exists()){
                       firebaseData= docSnap.data();
                       //console.log('Found data', firebaseData);
                   }
                   setGlobalData(firebaseData);
                } catch (err) {
                    // alert("hi");
                    console.log(err.message);
                }finally{
                    setIsLoading(false);
                }
         })
        return unsubscribe;
        
    },[])



    
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}