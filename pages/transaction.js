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
        <table className="w-full table-auto border border-solid text-white">
            <thead className="border border-solid">
                <td className="border border-solid pl-5">Payment ID</td>
                <td className="border border-solid pl-5">Amount</td>
                <td className="border border-solid pl-5">From</td>
            </thead>
            <tbody>
          {payments.map((payment) => (
            <tr
              key={payment.razorpay_payment_id}
            >
              <td className="border border-solid pl-5">
                {payment.razorpay_payment_id}
              </td>
              <td className="border border-solid pl-5">
                {payment.amount}
              </td>
              <td className="border border-solid pl-5">
                {payment.fromname}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
