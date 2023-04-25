import Head from "next/head";
import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { auth } from "../services/firebase.js";
import { firestore } from "../services/firebase.js";
import { clcik, contract } from "../services/transactweb3.js";
import Web3 from "web3";
import { abi } from "../services/transactweb3.js";
import { doc } from "firebase/firestore";
import { useUserContext } from "../services/userContext.js";
import { async } from "@firebase/util";
import { useRouter } from "next/router";
import { Signer, ethers } from "ethers";
import { transactionDataContractAddress } from "@/constants/contract-address.js";
import TransactionData from "../artifacts/contracts/transact.sol/TransactionData.json";

export default function pay() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [paySuccess, setPaySuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState("");
  let web3;
  const [defaultacc, setdefaultacc] = useState();
  const [transhash, settranshash] = useState("");
  const { user } = useUserContext();
  const [localData, setLocalData] = useState();
  const [orgs, setOrgs] = useState([]);
  const [connection, setConnection] = useState();
  const router = useRouter();

  useEffect(() => {
    fetchNGO();
  }, []);

  function fetchNGO() {
    const docRef = collection(firestore, "Users");
    const q = query(docRef, where("type", "==", "NGOs"));
    getDocs(q)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const { username, ngoId } = doc.data();
          setOrgs([...orgs, { id: doc.id, username, ngoId }]);
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function validateFormWithJS() {
    const amount = document.getElementById("amount").value;

    if (!amount) {
      alert("Please enter Amount.");
      return false;
    }
    // displayRazorpay(Amount)
  }
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const addToChain = async (value) => {
    // Create Contract
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const balance = await provider.getBalance(account);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      transactionDataContractAddress,
      TransactionData.abi,
      signer
    );

    const connection = contract.connect(signer);

    const result = await contract.addTransaction(connection.address, value);

    return result.hash;
  };

  const displayRazorpay = async (amount) => {
    var myHeaders = new Headers();

    myHeaders.append(
      "Authorization",
      "Basic cnpwX3Rlc3RfRDRzRHVKNWEzZkVMeDE6d1ZnMVRMYzJpZEtkZDc1QlZEVFRRaVow"
    );
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      amount: amount * 100,
      currency: "INR",
    });

    var requestOptions = {
      method: "POST",
      mode: "no-cors",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://api.razorpay.com/v1/orders", requestOptions)
      .then(async (result) => {
        const res = await loadScript(
          "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
          alert("you are offline");
          return;
        }

        const options = {
          key: "rzp_test_W488yU9uOndfwZ",
          amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "",
          description: "Test Transaction",
          handler: function (res) {
            const transactionHash = addToChain(amount)
              .then((hash) => {
                console.log(hash);
                settranshash(hash)
                addDoc(collection(firestore, "payments"), {
                  id,
                  amount,
                  hash,
                  fromname: auth.currentUser.displayName,
                  ...res,
                })
                  .then(() => console.log("Document was saved"))
                  .catch((e) => alert(`Error occured : ${JSON.stringify(e)}`));
              })
              .catch((err) => console.error(err));

            setPaySuccess(true);
            setPaymentDetails({
              ...res,
              amount,
            });
          },
          // "order_id": "order_KTL3lGufa5nvgB", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          order_id: result.order_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
          theme: {
            color: "#3399cc",
          },
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
      })
      .catch((error) => console.log("error", error));
    //     return;
  };

  return (
    <div className="container mx-auto">
  <Head>
    <title>Make a Donation</title>
    <meta name="description" content="Donate to a cause you care about" />
    <link rel="icon" href="/favicon.ico" />
  </Head>

  <h1 className="text-5xl font-bold text-center mt-14">Make a Donation</h1>

  <p className="mt-4 mb-10 text-lg text-center">
    Your donation can make a difference in someone's life today.
  </p>

  {paySuccess ? (
    <SuccessPage
      payment_id={paymentDetails.razorpay_payment_id}
      amount={paymentDetails.amount}
      transhash={transhash}
    />
  ) : (
    <div className="px-4">
      <div className=" gap-4 md:grid-cols-2 md:gap-8 mb-10 flex flex-col">
        <label htmlFor="charity" className="block text-lg font-medium text-gray-700">
          Select a NGO:
        </label>
        <select
          className="select select-bordered w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          id="charity"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        >
          <option value="Select">-- Please Select --</option>
          {orgs.map((e) => (
            <option value={e.id}>
              {e.username} - {e.ngoId}
            </option>
          ))}
        </select>

        <label htmlFor="amount" className="block text-lg font-medium text-gray-700 mt-6">
          Donation Amount:
        </label>
        <input
          className="input input-bordered w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Enter donation amount"
          type="number"
          name="amount"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.currentTarget.value)}
        />
      </div>

      <div className="flex flex-col items-center">
        <button
          className="btn btn-primary w-full md:w-64 py-2 px-4 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => displayRazorpay(amount)}
        >
          Donate Now
        </button>
        <div className="mt-6 text-sm font-medium text-gray-500 justify justify-center">
          <div className="justify justify-end mx-20">OR</div><br/>
          <a
            className="donate-with-crypto inline-block px-4 py-2 ml-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            href="https://commerce.coinbase.com/checkout/e8bfba4f-9db2-44aa-a5c4-67cd37112f69"
          >
            Donate with Crypto
          </a>
          <script src="https://commerce.coinbase.com/v1/checkout.js?version=201807"></script>
        </div>
      </div>
    </div>
  )}
</div>
  );
}

function SuccessPage({ payment_id, amount, transhash }) {
  return (
    <div class="bg-gray-100 min-h-screen py-12">
      <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="bg-green-500 px-6 py-8">
          <h2 class="text-4xl font-bold text-white">Payment Successful</h2>
        </div>
        <div class="p-8">
          <div class="flex flex-col gap-4">
            <div class="flex justify-between border-b-2 border-gray-300 pb-4">
              <p class="text-lg font-medium text-gray-700">Payment ID:</p>
              <p class="text-lg font-medium text-gray-900">{payment_id}</p>
            </div>
            <div class="flex justify-between border-b-2 border-gray-300 pb-4">
              <p class="text-lg font-medium text-gray-700">Amount:</p>
              <p class="text-lg font-medium text-green-500">${amount}</p>
            </div>
            <div class="flex justify-between gap-5">
              <p class="text-lg font-medium text-gray-700 gap-3">Transaction Hash:</p>
              <p class="text-lg font-medium text-gray-900 break-all overflow-x-auto py-2 px-4 rounded-lg bg-gray-200 gap-8">{ transhash }</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
