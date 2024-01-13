import { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { ethers } from "ethers";
import { firestore } from "@/services/firebase";
import { useUserContext } from "@/services/userContext";
import TreeToken from "@/artifacts/contracts/TreeNFT.sol/TreeToken.json";
import Link from "next/link";
import { treeContractAddress } from "@/constants/contract-address";
import Head from "next/head";
import Image from "next/image";
import { useCollectionOnce } from "react-firebase-hooks/firestore";
import Loading from "@/components/Loading";
import { IconExternalLink } from "@tabler/icons-react";
import TreeCard from "@/components/TreeCard";

export default function () {
  //To Do: Fetch image from firebase

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [result, setResult] = useState(null);

  const handleImage1Change = (e) => {
    const file = e.target.files[0];
    setImage1(file);
  };

  const handleImage2Change = (e) => {
    const file = e.target.files[0];
    setImage2(file);
  };

  const detectGrowth = async () => {
    setResult(null)
    try {
      const formData = new FormData();
      formData.append("file1", image1);
      formData.append("file2", image2);

      const response = await fetch("http://127.0.0.1:5000/detect_growth", {
        method: "POST",
        body: formData,
      });

      // Checking the response for growth
      if (response.ok) {
        const result = await response.json();
        console.log(result)
        // console.log(`Result from response ${result}`);
        setResult(result);
        console.log(result.growth_detected == "True" ? "Significant Growth Detected!" : "No Significant Growth Detected.");
        // alert(result.growth_detected == "True" ? "Significant Growth Detected!" : "No Significant Growth Detected.");
      } else {
        // alert("Failed to detect growth.");
        console.log("Failed to detect growth.");
      }
    } catch (error) {
      console.error("Error during growth detection:", error);
    }

    // Commenting for debugging
    //  finally {
    //   setImage1(null);
    //   setImage2(null);
    // };
  };

  return (
    <>
      <Head>
        <title>Growth Track</title>
      </Head>
      <div className="container mx-auto space-y-4 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 m-6 gap-y-6">
          <div className="gap-2">
            <label htmlFor="image1" className="">
              Upload Image 1:
            </label>
            <input
              className="input"
              type="file"
              id="image1"
              accept="image/*"
              onChange={handleImage1Change}
            />
          </div>
          <div className="gap-2">
            <label htmlFor="image2" className="">
              Upload Image 2:
            </label>
            <input
              className="input"
              type="file"
              id="image2"
              accept="image/*"
              onChange={handleImage2Change}
            />
          </div>
          <div className="space-y-2">
            <button onClick={detectGrowth} className="btn btn-primary">
              Detect Growth
            </button>
          </div>
        </div>
        {result && (
          <div className="container mx-auto space-y-4 px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto">
              <table className="table w-full table-compact">
                <thead>
                  <tr>
                    <th>Growth Detected</th>
                    <th>Growth Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {result.growth_detected === "True" ? (
                        <span className="text-green-500">Significant Growth Detected!</span>
                      ) : (
                        <span className="text-red-500">No Significant Growth Detected</span>
                      )}
                    </td>
                    <td>{result.mse && result.mse.toFixed(3)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="overflow-x-auto">
              <table className="table w-full table-compact">
                <thead>
                  <tr>
                    <th>Mask of Image 1</th>
                    <th>Mask of Image 2</th>
                    <th>Difference Mask</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {result.maskeda_thresh1 && (
                        <img
                          src={`data:image/png;base64,${result.maskeda_thresh1}`}
                          alt="Masked Image 1"
                          className="border"
                          style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                      )}
                    </td>
                    <td>
                      {result.maskeda_thresh2 && (
                        <img
                          src={`data:image/png;base64,${result.maskeda_thresh2}`}
                          alt="Masked Image 2"
                          className="border"
                          style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                      )}
                    </td>
                    <td>
                      {result.diff && (
                        <img
                          src={`data:image/png;base64,${result.diff}`}
                          alt="Difference Image"
                          className="border"
                          style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
