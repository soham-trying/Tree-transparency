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
        <title>Payment Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-5xl font-bold text-center mt-14">Donation</h1>

      <p className="mt-4 mb-10 text-lg text-center">
        No one has ever become poor from giving
      </p>

      {paySuccess ? (
        <SuccessPage
          payment_id={paymentDetails.razorpay_payment_id}
          amount={paymentDetails.amount}
          transhash={transhash}
        />
      ) : (
        <div className="px-4">
          <div className="grid w-full gap-5 mb-10">
            <select
              className="select select-bordered"
              id="grid-state"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            >
              <option value="Select">Select</option>
              {orgs.map((e) => (
                <option value={e.id}>
                  {e.username} - {e.ngoId}
                </option>
              ))}
            </select>

            <input
              className="input input-bordered"
              placeholder="Amount"
              type="number"
              name="Amount"
              id="Amount"
              value={amount}
              onChange={(e) => setAmount(e.currentTarget.value)}
            />
          </div>

          <div className="flex flex-col items-center">
            <button
              className="btn btn-primary"
              onClick={() => displayRazorpay(amount)}
            >
              Donate Now
            </button>
            <div className="divider">OR</div>
            <div>
              <a
                className="donate-with-crypto"
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
    <div className="container px-4 mx-auto mt-4 rounded-xl">
      <div className="grid gap-3 p-10 bg-white rounded-md shadow-md place-items-center">
        <h2 className="text-4xl font-bold text-green-600">
          Payment Successful
        </h2>
        <div className="flex gap-3 text-lg">
          <p>Payment ID: </p>
          <p>{payment_id}</p>
        </div>
        <div className="flex gap-3 text-lg">
          <p>Amount: </p>
          <p>{amount}</p>
        </div>
        <div className="flex gap-3 text-lg">
          <p>Transaction Hash: </p>
          <p>{transhash}</p>
        </div>
      </div>
    </div>
  );
}
