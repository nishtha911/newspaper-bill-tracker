import { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:3000/api';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyEntries, setDailyEntries] = useState({});

  // Fetch saved daily entries for the current month
  useEffect(() => {
    async function fetchDailyEntries() {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      try {
        const response = await fetch(`${API_BASE_URL}/daily-entries/${year}/${month}`);
        const data = await response.json();
        const entriesMap = {};
        data.forEach(entry => {
          const day = new Date(entry.date).getDate();
          entriesMap[day] = entry;
        });
        setDailyEntries(entriesMap);
      } catch (error) {
        console.error('Error fetching daily entries:', error);
      }
    }
    fetchDailyEntries();
  }, [currentDate]);

  const handleDayChange = async (day, newspaper, value) => {
    const newEntries = { ...dailyEntries };
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().slice(0, 10);
    
    if (!newEntries[day]) {
      newEntries[day] = {
        date,
        aaj_ka_anand_price: 0,
        times_of_india_price: 0
      };
    }
    
    // Update the price based on the input
    if (newspaper === "Aaj ka Anand Price") {
      newEntries[day].aaj_ka_anand_price = parseFloat(value) || 0;
    } else if (newspaper === "Times of India Price") {
      newEntries[day].times_of_india_price = parseFloat(value) || 0;
    }

    // Immediately calculate and update the total in the local state for a smooth UI
    const aajKaAnandTotal = (newEntries[day].aaj_ka_anand_price || 0);
    const timesOfIndiaTotal = (newEntries[day].times_of_india_price || 0);
    newEntries[day].total_daily_price = aajKaAnandTotal + timesOfIndiaTotal;

    setDailyEntries(newEntries);

    // Send the updated data to the backend for calculation and saving
    try {
      await fetch(`${API_BASE_URL}/daily-entry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: newEntries[day].date,
          aaj_ka_anand_price: newEntries[day].aaj_ka_anand_price,
          times_of_india_price: newEntries[day].times_of_india_price
        })
      });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const getDayOfWeek = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayIndex = date.getDay();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames[dayIndex];
  };

  const daysInMonth = getDaysInMonth();
  const firstDay = getFirstDayOfMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const emptyCells = Array(firstDay).fill(null);

  const renderDays = () => {
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const entry = dailyEntries[i] || {};
      const aajKaAnandPrice = entry.aaj_ka_anand_price || '';
      const timesOfIndiaPrice = entry.times_of_india_price || '';
      
      const dayOfWeek = getDayOfWeek(i);
      
      days.push(
        <div key={i} className="day-cell">
          <div className="day-number">{i}</div>
          <div className="input-group">
            <label>Hindi</label>
            <input
              type="number"
              value={aajKaAnandPrice}
              onChange={(e) => handleDayChange(i, 'Aaj ka Anand Price', e.target.value)}
              onWheel={handleWheel}
            />
          </div>
          <div className="input-group">
            <label>English</label>
            <input
              type="number"
              value={timesOfIndiaPrice}
              onChange={(e) => handleDayChange(i, 'Times of India Price', e.target.value)}
              onWheel={handleWheel}
            />
          </div>
        </div>
      );
    }
    return days;
  };

  const renderTotals = () => {
    let grandTotal = 0;
    
    for (const day in dailyEntries) {
        const entry = dailyEntries[day];
        if (entry) {
            grandTotal += entry.total_daily_price || 0;
        }
    }
    
    return (
        <div className="summary">
            <h3>Monthly Bill Summary</h3>
            <p className="total-bill">Grand Total: ₹<span id="grand-total">{grandTotal.toFixed(2)}</span></p>
        </div>
    );
  };
  
  const handlePrevMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
  };

  return (
    <div className="calendar-container">
      <div className="header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h2>{`${monthName} ${year}`}</h2>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="weekdays">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>
      <div className="days">
        {emptyCells.map((_, index) => <div key={`empty-${index}`} className="empty-day-cell"></div>)}
        {renderDays()}
      </div>
      {renderTotals()}
    </div>
  );
}

export default App;