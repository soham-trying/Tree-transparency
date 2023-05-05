import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { firestore } from "../services/firebase.js";

export default function Transactions() {
  const [isFetching, setFetching] = useState(true);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  function fetchPayments() {
    setFetching(true);
    let data = [];

    getDocs(collection(firestore, "payments")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      setFetching(false);
      setPayments(data);
    });
  }

  return (
    <div>
      {isFetching ? (
        <div className="text-white">Fetching</div>
      ) : (
        <table className="w-full text-white table-auto">
          <thead>
            <th>Payment ID</th>
            <th>Amount</th>
            <th>From</th>
            <th>To</th>
            <th>Hash</th>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.razorpay_payment_id}>
                <td>{payment.razorpay_payment_id}</td>
                <td>{payment.amount}</td>
                <td>{payment.fromname}</td>
                <td>{payment.name}</td>
                <td className="truncate">
                  <input
                    className="p-2 text-black border rounded"
                    value={payment.hash}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
