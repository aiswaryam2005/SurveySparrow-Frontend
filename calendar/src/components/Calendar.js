import React, { useState, useEffect } from "react";
import "./Calendar.css";
import eventsData from "../data/events.json";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  const days = [];

  const handleDateClick = (dateStr) => {
    const events = eventsData.filter(e => e.date === dateStr);
    setSelectedDateEvents(events);
    setShowModal(true);
  };

  const formatDate = (day) => {
    return new Date(year, month, day).toISOString().split("T")[0];
  };

  for (let i = 1; i <= endOfMonth.getDate(); i++) {
    const dateStr = formatDate(i);
    const eventsForDay = eventsData.filter(event => event.date === dateStr);
    const isToday = today.toDateString() === new Date(year, month, i).toDateString();

    days.push(
      <div
        key={i}
        className={`day ${isToday ? "today" : ""}`}
        onClick={() => handleDateClick(dateStr)}
      >
        <div className="day-number">{i}</div>
        <div className="events">
          {eventsForDay.slice(0, 2).map((event, index) => (
            <div
              key={index}
              className="event"
              style={{ backgroundColor: event.color }}
              title={`${event.title} (${event.startTime} - ${event.endTime})`}
            >
              {event.title}
            </div>
          ))}
          {eventsForDay.length > 2 && (
            <div className="more-events">+{eventsForDay.length - 2} more</div>
          )}
        </div>
      </div>
    );
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h2>
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div className="day-name" key={day}>{day}</div>
        ))}
        {Array(startOfMonth.getDay()).fill(null).map((_, i) => (
          <div key={`empty-${i}`} className="empty-day"></div>
        ))}
        {days}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Events</h3>
            {selectedDateEvents.length === 0 ? (
              <p>No events</p>
            ) : (
              <ul>
                {selectedDateEvents.map((event, i) => (
                  <li key={i}>
                    <strong>{event.title}</strong><br />
                    {event.startTime} - {event.endTime}
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
