
import { render } from "react-dom";
import {  BrowserRouter,  Routes,  Route} from "react-router-dom";
import App from './App';
import Login from './login';
import Home from './Home';
import Configuration from './Configuration';
import Events from './EventsList';
import Dashboard from './Dashboard';

render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/login" element={<Login />} />
    <Route path="/home" element={<Home />} />
    <Route path="/configuration" element={<Configuration />} />
    <Route path="/events" element={<Events />} />
    <Route path="/Dashboard" element={<Dashboard />} />

    {/* <Route path="/eventadd" element={<EventsAdd />} /> */}

  </Routes>
</BrowserRouter>,
  document.getElementById("root")
);