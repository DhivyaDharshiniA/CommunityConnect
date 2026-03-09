// import React, { useState } from "react";
// import axios from "axios";
//
// export default function DonatePage({ request, close, refresh }) {
//
//   const [amount, setAmount] = useState("");
//
//   const handleDonate = async () => {
//
//     try {
//
//       await axios.post(
//         "http://localhost:8080/api/donation/donate",
//         {
//           donorName: "Anonymous",
//           donorEmail: "donor@gmail.com",
//           amount: Number(amount),
//           paymentMethod: "UPI",
//           helpRequest: {
//             id: request.id
//           }
//         }
//       );
//
//       alert("Donation successful");
//
//       setAmount("");
//       close();
//       refresh();
//
//     } catch {
//
//       alert("Donation failed");
//
//     }
//
//   };
//
//   return (
//
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
//
//       <div className="bg-white p-6 rounded-xl shadow w-96">
//
//         <h2 className="text-xl font-semibold mb-4">
//           Donate to {request.title}
//         </h2>
//
//         <input
//           type="number"
//           placeholder="Enter amount"
//           value={amount}
//           onChange={(e)=>setAmount(e.target.value)}
//           className="border p-2 rounded w-full mb-4"
//         />
//
//         <div className="flex gap-3">
//
//           <button
//             onClick={handleDonate}
//             className="bg-green-500 text-white px-4 py-2 rounded w-full"
//           >
//             Donate
//           </button>
//
//           <button
//             onClick={close}
//             className="bg-gray-400 text-white px-4 py-2 rounded w-full"
//           >
//             Cancel
//           </button>
//
//         </div>
//
//       </div>
//
//     </div>
//   );
// }import React, { useState, useEffect } from "react";
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