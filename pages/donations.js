import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  getDoc,
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
        // doc.data() is never undefined for query doc snapshots
        // alert(doc.id + " => " + doc.data());
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
        <table className="w-full table-auto text-white">
            <thead>
                <td>Payment ID</td>
                <td>Amount</td>
                <td>From</td>
                <td>To</td>
                <td>Hash</td>
            </thead>
            <tbody>
          {payments.map((payment) => (
            <tr
              key={payment.razorpay_payment_id}
            >
              <td>
                {payment.razorpay_payment_id}
              </td>
              <td>
                {payment.amount}
              </td>
              <td>
                {payment.fromname}
              </td>
              <td>
                {payment.name}
              </td>
              <td className="truncate">
                <input className="p-2 border rounded text-black" value={payment.hash} />
                </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
