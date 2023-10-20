import {
  useDocumentDataOnce,
  useDocumentOnce,
} from "react-firebase-hooks/firestore";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "@/services/firebase";
import Link from "next/link";
import { IconCircleCheck, IconCircleX, IconCopy } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useUserContext } from "@/services/userContext";

export default function Tree({
  id,
  name,
  imageUrl,
  species,
  isVerified,
  ngo,
  type,
  description,
  adoptedBy,
  verifiedBy,
  ipfsHash,
  transactionHash,
}) {
  const router = useRouter();

  const [ngoDoc, ngoLoading, ngoError] = useDocumentDataOnce(
    doc(firestore, "Users", ngo)
  );

  return (
    <>
      <div className="max-w-4xl px-4 pt-6 mx-auto">
        <nav className="mb-4">
          <div className="breadcrumbs">
            <ul>
              <li>
                <Link href="/tree/adopt">Trees</Link>
              </li>
              <li>{id}</li>
            </ul>
          </div>
        </nav>
        <div className="max-w-full prose prose-lg">
          <h1>{name}</h1>
          <p>{description}</p>

          <table>
            <tbody>
              <tr>
                <td>Species</td>
                <td>{species}</td>
              </tr>

              <tr>
                <td>Type</td>
                <td>{type}</td>
              </tr>

              <tr>
                <td>IPFS Hash</td>
                <td>
                  <Link href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}>
                    {ipfsHash}
                  </Link>
                </td>
              </tr>
              

              <tr>
                <td>Verified</td>
                <td>
                  {!isVerified ? (
                    <div className="gap-2 btn btn-sm btn-error">
                      <span>
                        <IconCircleX />
                      </span>
                      Unverified
                    </div>
                  ) : (
                    <button
                      onClick={() => unVerifyTree()}
                      className="gap-2 btn btn-sm btn-success"
                    >
                      <span>
                        <IconCircleCheck />
                      </span>
                      Verified
                    </button>
                  )}
                </td>
              </tr>

              {isVerified && (
                <tr>
                  <td>Verified By</td>
                  <td>{verifiedBy}</td>
                </tr>
              )}

              <tr>
                <td>Adopted By</td>
                <td>{!adoptedBy ? "Not Adopted" : adoptedBy}</td>
              </tr>

              {ngo && (
                <tr>
                  <td>NGO</td>
                  <td>
                    <Link href={`/ngo/${ngo}`}>{ngoLoading ? "Loading" : ngoDoc.username}</Link>
                  </td>
                </tr>
              )}

              {transactionHash && (
                <tr>
                  <td>Transaciton Hash</td>
                  <td>
                    <div className="input-group">
                      <input
                        type="text"
                        value={transactionHash}
                        className="input input-bordered"
                      />
                      <button
                        className="btn btn-square"
                        onClick={() =>
                          navigator.clipboard.writeText(transactionHash)
                        }
                      >
                        <IconCopy />
                      </button>
                    </div>
                  </td>
                  
                </tr>
                
                
              )}
              <tr>
                <td className="align-top">NFT</td>
                <td><img className="w-48 h-80 rounded-xl" src={imageUrl} alt={name} /></td>
              </tr> 
            </tbody>
          </table>

          
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const tree = await getDoc(doc(firestore, "Trees", context.params.id));
  const adoptedBy = tree.data()?.adoptedBy?.id || "";
  const ngo = tree.data()?.ngo?.id || "";
  const verifiedBy = tree.data()?.verifiedBy?.id || "";

  return {
    props: {
      id: tree.id,
      ...tree.data(),
      adoptedBy,
      ngo,
      verifiedBy,
    },
  };
}
