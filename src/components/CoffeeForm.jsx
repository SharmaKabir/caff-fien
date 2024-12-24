import { coffeeOptions } from "../utils"
import { useState } from "react"
import Modal from "./Modal";
import Authentication from "./Authentication";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function CoffeeForm(props) {
    //if you try to submit without sign in, modal open
    const { isAuthenticated }=props;
    const [showModal, setShowModal]=useState(false);
    const [selectedCoffee, setSelectedCoffee] = useState(null);
    const [showCoffeeTypes, setShowCoffeeTypes] = useState(false);
    const [coffeeCost, setCoffeeCost] = useState(0);
    const[hour, setHour]=useState(0);
    const[min, setMin]=useState(0);
    const {globalData, setGlobalData, globalUser} = useAuth();




    async function handleSubmitForm(){
        if(!isAuthenticated){
            setShowModal(true);
            return;
            
        }
        //define guard that only submit form if its complete
        if(!selectedCoffee ){
            return;
        }

        try {
            const newGlobalData = {
                ...(globalData || {})
            }
            const nowTime=Date.now();
            const timeToSubtract=(hour *60 *60 *1000)  + (min *60 *100); //conv to ms
            const timestamp=nowTime - timeToSubtract;
            
            const newData={
                name: selectedCoffee,
                cost: coffeeCost
            }
            //then create new data object as state is immutabale
            newGlobalData[timestamp] = newData;
            console.log(selectedCoffee, coffeeCost,timestamp);
    
            //update globalstate and 
            setGlobalData(newGlobalData);
            //persist data in firestore 
            const useRef=doc(db, 'users', globalUser.uid);
            const res = await setDoc(useRef, {
                [timestamp]: newData}, {merge:true}
            );
            setSelectedCoffee(null);
            setHour(0);
            setMin(0);
            setCoffeeCost(0);
        } catch (error) {
            console.error(error);
        }





        
        
        
    }




    return(
        <>
        {showModal && (<Modal handleCloseModal={()=>setShowModal(false)}>
                    <Authentication  handleCloseModal={()=>setShowModal(false)}/>
                </Modal>)}
            <div className="section-header">
                <i className="fa-solid fa-pencil"></i>
                <h2>Start Tracking Today</h2>
            </div>
            <h4>Select coffee type</h4>
            <div className="coffee-grid">
                {coffeeOptions.slice(0,5).map(( option, optionIndex) => {
                    return(
                        <button onClick={()=>{
                            setSelectedCoffee(option.name); //select primary 5, get pretty border 
                            setShowCoffeeTypes(false); //hide menu
                        }} className={"button-card " + (option.name === selectedCoffee ? ' coffee-button-selected':'') } key={optionIndex}>
                            <h4>{option.name}</h4>
                            <p>{option.caffeine} mg</p>
                        </button>
                    )
                })}
                <button  onClick={ ()=>{
                    setShowCoffeeTypes(true); //show menu
                    setSelectedCoffee(null); //deselect primary , border goes away, dropdown shows
                } } className={"button-card " + (showCoffeeTypes ? ' coffee-button-selected':'') }>
                    <h4>Other</h4>
                    <p>n/a</p>
                </button>
            </div>
            { showCoffeeTypes &&(
                <select onChange={ (event)=>{
                    setSelectedCoffee(event.target.value);
                }} id="coffee-list" name="coffee-list">
                <option value={null}> Select type</option>
                {coffeeOptions.map((option, optionIndex) => {
                    return(
                        <option key={optionIndex} value={option.name}>
                            {option.name} ({option.caffeine}mg)
                        </option>
                    )
                })}
            </select>
            )}

            <h4>Add the cost ($)</h4>
            <input className="w-full" type="number" value={coffeeCost} onChange={(e)=>{
                setCoffeeCost(e.target.value);
            }}placeholder="4.50"/>
            <h4>Time since consumption</h4>
            <div className="time-entry">
                <div>
                    <h6>Hours</h6>
                    <select  onChange={(e)=>{
                        setHour(e.target.value);
                    }}id="hours-select">
                        {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map((hour, hourIndex) =>{
                            return(
                                <option key={hourIndex} value={hour}>{hour}</option>
                            )
                        })}
                    </select>
                </div>
                <div>
                    <h6>Mins</h6>
                    <select  onChange={(e)=>{
                        setMin(e.target.value);
                    }}id="mins-select">
                        {[0,5,10,15,30,45].map((min, minIndex) =>{
                            return(
                                <option key={minIndex} value={min}>{min}</option>
                            )
                        })}
                    </select>
                </div>

            </div>
            <button onClick={handleSubmitForm}>
                <p>Add Entry</p>
            </button>
        </>
    )
}