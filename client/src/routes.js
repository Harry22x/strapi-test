import LandingPage from "./Pages/LandingPage";
import App from "./App";
import AddTicket from "./Pages/AddTicket";
import EventPage from "./Pages/EventPage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import ProfilePage from "./Pages/Profile";
import CreateEvent from "./Pages/CreateEvent";
import MoreEvents from "./Pages/MoreEvents";
import Account from "./Pages/Account";
import Contact from "./Pages/ContactPage";
import Calender from "./Pages/Calender";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import Dashboard from "./Pages/OrganizerDashboard";
import AttendeeDashboard from "./Pages/AttendeeDashboard";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/add-ticket", element: <AddTicket /> },
      {path:"/events/:id", element: <EventPage/>},
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      {path:"/profile", element: <ProfilePage/>},      
      { path:"/create-event",element: <CreateEvent /> },
      {path:"/more-events", element:<MoreEvents />},
      {path:"/contact", element:<Contact /> },
      { path:"/calender", element:<Calender />},
      {path:"/forgot-password", element:<ForgotPassword/>},
      {path:"/reset-password", element:<ResetPassword/>},
      {path:"/organizer-dashboard", element:<Dashboard/>},
      {path:"/attendee-dashboard", element:<AttendeeDashboard/>}
    ],
  },
];

export default routes;
