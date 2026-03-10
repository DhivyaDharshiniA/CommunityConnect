import { useEffect, useState } from "react";
import axios from "axios";

export default function CommunityRequests() {

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/help/open")
      .then(res => setRequests(res.data));
  }, []);

  return (
    <div>
      <h2>Community Help Requests</h2>

      {requests.map(r => (
        <div key={r.id}>
          <h3>{r.title}</h3>
          <p>{r.description}</p>
          <p>₹{r.amountRaised} / ₹{r.amountNeeded}</p>
        </div>
      ))}
    </div>
  );
}