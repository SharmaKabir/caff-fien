import { calculateCoffeeStats, calculateCurrentCaffeineLevel, coffeeConsumptionHistory, statusLevels, getTopThreeCoffees } from "../utils";
import { useAuth } from "../context/AuthContext";
function StatCard(props) {
    const {lg, title, children} = props;
    return(
        // () makes it calc first
        <div className={'card start-card' + (lg ? ' col-span-2':'')}>
            <h4>{title}</h4>
            {children}
        </div>
    )
}


export default function Stats() {
    const {globalData} = useAuth();
    const stats= calculateCoffeeStats(globalData);
        // daily_caffeine:240,
        // daily_cost:6.8,
        // average_coffees:2,
        // total_cost:100
       
    

    const caffeineLevel = calculateCurrentCaffeineLevel(globalData);
    const warningLevel= caffeineLevel < statusLevels['low'].maxLevel ? 'low' : caffeineLevel < statusLevels['moderate'].maxLevel ? 'moderate' : 'high';

    return(
        <>
        <div className="section-header">
            <i className="fa-solid fa-chart-simple"></i>
            <h2>Stats</h2>
        </div>
        <div className="stats-grid">
            <StatCard lg title="Active Caffeiene Level">
                <div className="status">
                    <p><span className="stat-text">{caffeineLevel}</span>mg</p>
                    <h5 style={{color:statusLevels[warningLevel].color, backgorund:statusLevels[warningLevel].background}}>{warningLevel}</h5>
                </div>
                <p>{statusLevels[warningLevel].description}</p>
            </StatCard>
            <StatCard title="Daily Caffeine">
                <p><span className="stat-text">{stats.daily_caffeine}</span>mg</p>
            </StatCard>
            <StatCard title="Avg # of Coffees">
                <p><span className="stat-text">{stats.average_coffees}</span></p>
            </StatCard>
            <StatCard title="Daily Cost ($)">
                <p>$ <span className="stat-text">{stats.daily_cost}</span></p>
            </StatCard>
            <StatCard title="Total Cost ($)">
                <p>$ <span className="stat-text">{stats.total_cost}</span></p>
            </StatCard>
            <table className="stat-table">
                <thead>
                    <tr>
                    <th>Coffee Name</th>
                    <th>Number of Purchases</th>
                    <th>% of Total</th>
                    </tr>
                </thead>
                <tbody>
                        {getTopThreeCoffees(globalData).map((coffee, coffeeIndex) => {
                            return (
                                <tr key={coffeeIndex}>
                                    <td>{coffee.coffeeName}</td>
                                    <td>{coffee.count}</td>
                                    <td>{coffee.percentage}</td>
                                </tr>
                            )
                        })}
                    </tbody>
             </table>   
        </div>
        </>
    )
}