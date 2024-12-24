import { coffeeConsumptionHistory, getCaffeineAmount, timeSinceConsumption, calculateCurrentCaffeineLevel } from "../utils";
import { useAuth } from "../context/AuthContext";
export default function History() {
    const {globalData} = useAuth();
    return(
        <>
         <div className="section-header">
                <i className="fa-solid fa-timeline" />
                <h2>History</h2>
        </div>
        <p><i>Hover for more information</i></p>
        <div className="coffee-history">
            {/* //sort for chronology */}
            {Object.keys(globalData).sort((a, b) => b - a).map((utcTime, coffeeIndex) => {
                //const coffee = globalData[utcTime];
                //const timeSinceConsume = timeSinceConsumption(utcTime);
                //const originalAmount = getCaffeineAmount(coffee.name);
                //const remainingAmount = calculateCurrentCaffeineLevel({ [utcTime]: coffee });
                //const summary = `Consumed ${coffee.name} ${timeSinceConsume} ago. Original amount: ${originalAmount}mg, Remaining amount: ${remainingAmount}mg`;
                const coffee=globalData[utcTime];
                const timeSinceConsume=timeSinceConsumption(utcTime);
                const originalAmount=getCaffeineAmount(coffee.name);
                const remainingAmount=calculateCurrentCaffeineLevel({[utcTime]:coffee});
                const summary = `${coffee.name} | ${timeSinceConsume} | $${coffee.cost} | ${remainingAmount}mg / ${originalAmount}mg`

                return (
                    <div title={summary} key={coffeeIndex}>
                        <i className="fa-solid fa-mug-hot" />
                    </div>
                );
            })}
        </div>
        </>
    )
}