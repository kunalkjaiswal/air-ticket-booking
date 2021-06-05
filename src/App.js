import './App.css';
import Banner from '../src/components/banner/Banner';
import Booking from '../src/containers/booking/Booking';

function App() {
  return (
    <div className="App">
      <div className="main-page">
          <Banner bannerText='Air Ticket Booking'/>
          <Booking/>
      </div>
    </div>
  );
}

export default App;
