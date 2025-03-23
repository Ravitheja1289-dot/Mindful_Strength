import React from "react";
import ReactDOM from "react-dom/client";
import MentalHealthApp from './components/MentalHealthApp';
import './components/MentalHealthApp.css';

function App() {
  return (
    <div>
      <MentalHealthApp />
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

export default App;


