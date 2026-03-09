    import axios from "axios";

    const DonatePage = () => {

      const [helpRequests, setHelpRequests] = useState([]);
      const [selectedRequest, setSelectedRequest] = useState(null);
      const [amount, setAmount] = useState("");

      useEffect(() => {
        axios.get("http://localhost:8080/api/help/open")
          .then(res => setHelpRequests(res.data))
          .catch(err => console.error(err));
      }, []);

      const handleDonate = () => {

        if (!selectedRequest || !amount) {
          alert("Select request and enter amount");
          return;
        }

        const donation = {
          donorName: "Anonymous",
          donorEmail: "donor@gmail.com",
          amount: parseFloat(amount),
          paymentMethod: "UPI"
        };

        axios.post(`http://localhost:8080/api/donation/${selectedRequest.id}`, donation)
          .then(() => {
            alert("Donation Successful!");
            setAmount("");
          })
          .catch(err => console.error(err));
      };

      return (
        <div className="donate-page">

          <h2>Donate to a Help Request</h2>

          <select
            onChange={(e) =>
              setSelectedRequest(helpRequests[e.target.value])
            }
          >

            <option value="">Select a Request</option>

            {helpRequests.map((req, index) => (
              <option key={req.id} value={index}>
                {req.title} - Needed: ₹{req.amountNeeded - req.amountRaised}
              </option>
            ))}

          </select>

          <br /><br />

          <input
            type="number"
            placeholder="Amount to Donate"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <br /><br />

          <button onClick={handleDonate}>
            Donate
          </button>

        </div>
      );
    };

    export default DonatePage;