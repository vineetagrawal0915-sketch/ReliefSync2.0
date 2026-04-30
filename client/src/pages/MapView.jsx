import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/tasks');
        // Filter tasks that have coordinates
        setTasks(res.data.filter(t => t.latitude && t.longitude));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Disaster Response Map</h2>
        <p className="text-sm text-slate-500">Visualizing active tasks and NGO distribution across affected regions.</p>
      </div>

      <div className="h-[600px] w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {tasks.map((task) => (
            <Marker key={task.id} position={[task.latitude, task.longitude]}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-slate-900">{task.title}</h3>
                  <p className="text-xs text-slate-600 my-1">{task.description}</p>
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="text-[10px] font-bold uppercase text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded w-fit">
                      {task.type}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded w-fit ${task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
