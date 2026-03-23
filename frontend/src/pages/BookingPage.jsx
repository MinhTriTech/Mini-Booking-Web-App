import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking, deleteBooking, getBookings } from "../services/api";

function BookingPage() {
  const navigate = useNavigate();
  const [bookingTime, setBookingTime] = useState("");
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  const loadBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      if (error.message.toLowerCase().includes("unauthorized") || error.message.toLowerCase().includes("token")) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      setMessage(error.message);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    loadBookings();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await createBooking({ bookingTime });
      setBookingTime("");
      await loadBookings();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteBooking(id);
      await loadBookings();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="page">
      <h1>Booking</h1>
      <button onClick={onLogout}>Logout</button>

      <form onSubmit={onSubmit} className="form">
        <label htmlFor="booking-time">Chọn ngày giờ</label>
        <input
          id="booking-time"
          type="datetime-local"
          value={bookingTime}
          onChange={(event) => setBookingTime(event.target.value)}
          required
        />
        <button type="submit">Tạo booking</button>
      </form>

      {message ? <p className="message error">{message}</p> : null}

      <h2>List booking</h2>
      <ul className="booking-list">
        {bookings.map((booking) => (
          <li key={booking.id}>
            <span>{new Date(booking.bookingTime).toLocaleString()}</span>
            <button onClick={() => onDelete(booking.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookingPage;
