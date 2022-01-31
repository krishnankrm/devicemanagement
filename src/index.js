
import { render } from "react-dom";
import {  BrowserRouter,  Routes,  Route} from "react-router-dom";
import App from './App';
import Login from './login';

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />}>
        {/* <Route index element={<Home />} />
        <Route path="teams" element={<Teams />}>
          <Route path=":teamId" element={<Team />} />
          <Route path="new" element={<NewTeamForm />} />
          <Route index element={<LeagueStandings />} />
        </Route> */}
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);