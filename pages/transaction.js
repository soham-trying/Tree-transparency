import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../services/firebase.js";
import Header from "@/components/Header.jsx";
import GuardedPage from "@/components/GuardedPage.jsx";

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
        console.log(doc.data());
      });

      setFetching(false);
      setPayments(data);
    });
  }

  return (
    <>
      <Header title="Transactions" />

      <div className="container mx-auto mt-12">
        {isFetching ? (
          <div className="text-white">Fetching</div>
        ) : (
          <table className="table w-full table-auto">
            <thead>
              <td>Payment ID</td>
              <td>Amount</td>
              <td>From</td>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.razorpay_payment_id}>
                  <td className="pl-5 border border-solid">
                    {payment.razorpay_payment_id}
                  </td>
                  <td className="pl-5 border border-solid">{payment.amount}</td>
                  <td className="pl-5 border border-solid">
                    {payment.fromUser}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
