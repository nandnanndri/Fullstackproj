import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "http://localhost:5225/api";

function App() {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newResourceName, setNewResourceName] = useState("");
  const [newResourceDesc, setNewResourceDesc] = useState("");
  const [newBooking, setNewBooking] = useState({
    resourceId: "",
    customerName: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    fetchResources();
    fetchBookings();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await axios.get(`${API_BASE}/Resources`);
      setResources(res.data);
    } catch (err) {
      console.error("Error fetching resources:", err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/Bookings`);
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const createResource = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/Resources`, {
        name: newResourceName,
        description: newResourceDesc,
      });
      setNewResourceName("");
      setNewResourceDesc("");
      fetchResources();
    } catch (err) {
      console.error("Error creating resource:", err);
    }
  };

  const createBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/Bookings`, {
        resourceId: parseInt(newBooking.resourceId),
        customerName: newBooking.customerName,
        startTime: newBooking.startTime,
        endTime: newBooking.endTime,
      });
      setNewBooking({
        resourceId: "",
        customerName: "",
        startTime: "",
        endTime: "",
      });
      fetchBookings();
    } catch (err) {
      console.error("Error creating booking:", err);
    }
  };

  const deleteResource = async (id) => {
    try {
      await axios.delete(`${API_BASE}/Resources/${id}`);
      fetchResources();
      fetchBookings();
    } catch (err) {
      console.error("Error deleting resource:", err);
    }
  };

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`${API_BASE}/Bookings/${id}`);
      fetchBookings();
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  return (
    <div className="App">
      <h1>Időpont-foglaló rendszer</h1>

      <section>
        <h2>Új erőforrás létrehozása</h2>
        <form onSubmit={createResource}>
          <input
            type="text"
            placeholder="Név"
            value={newResourceName}
            onChange={(e) => setNewResourceName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Leírás"
            value={newResourceDesc}
            onChange={(e) => setNewResourceDesc(e.target.value)}
          />
          <button type="submit">Létrehozás</button>
        </form>
      </section>

      <section>
        <h2>Erőforrások</h2>
        <ul>
          {resources.map((r) => (
            <li key={r.id}>
              <strong>{r.name}</strong> - {r.description}
              <button onClick={() => deleteResource(r.id)}>Törlés</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Új foglalás létrehozása</h2>
        <form onSubmit={createBooking}>
          <select
            value={newBooking.resourceId}
            onChange={(e) =>
              setNewBooking({ ...newBooking, resourceId: e.target.value })
            }
            required
          >
            <option value="">Válassz erőforrást</option>
            {resources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Ügyfél neve"
            value={newBooking.customerName}
            onChange={(e) =>
              setNewBooking({ ...newBooking, customerName: e.target.value })
            }
            required
          />
          <input
            type="datetime-local"
            value={newBooking.startTime}
            onChange={(e) =>
              setNewBooking({ ...newBooking, startTime: e.target.value })
            }
            required
          />
          <input
            type="datetime-local"
            value={newBooking.endTime}
            onChange={(e) =>
              setNewBooking({ ...newBooking, endTime: e.target.value })
            }
            required
          />
          <button type="submit">Foglalás</button>
        </form>
      </section>

      <section>
        <h2>Foglalások</h2>
        <ul>
          {bookings.map((b) => (
            <li key={b.id}>
              <strong>{b.resource?.name}</strong> - {b.customerName} (
              {new Date(b.startTime).toLocaleString()} -{" "}
              {new Date(b.endTime).toLocaleString()})
              <button onClick={() => deleteBooking(b.id)}>Törlés</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
