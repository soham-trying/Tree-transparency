import { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  updateDoc,
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

export default function () {
  // const [trees, setTrees] = useState([]);
  const [trees, loadingTrees, errorTrees, reloadTrees] = useCollectionOnce(
    collection(firestore, "Trees"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const { user } = useUserContext();

  const adoptTree = async (id, metadataURI) => {
    // Create Contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      treeContractAddress,
      TreeToken.abi,
      signer
    );
    const connection = contract.connect(signer);
    const result = await contract.mint(connection.address, metadataURI);
    const anotherResult = await result.wait();
    console.log(anotherResult);

    const treeRef = await updateDoc(doc(firestore, "Trees", id), {
      adoptedBy: doc(firestore, `Users/${user.email}`),
      transactionHash: result.hash,
    });

    reloadTrees();

    alert("Adopted Tree");
  };

  const deleteTree = async (id) => {
    await deleteDoc(doc(firestore, "Trees", id));
  };

  return (
    <>
      <Head>
        <title>Adopt Trees</title>
      </Head>
      <div className="container px-4 mx-auto sm:px-6">
        <div className="grid grid-cols-1 mt-6 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {errorTrees && <strong>Error: {JSON.stringify(error)}</strong>}
          {loadingTrees && <Loading />}
          {trees &&
            trees.docs.map((tree) => (
              <div className="" key={tree.id}>
                <div className="w-full overflow-hidden duration-200 bg-gray-200 rounded-md min-h-80 aspect-h-1 aspect-w-1 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <Image
                    width={200}
                    height={320}
                    src={tree.data().imageUrl || ""}
                    alt={tree.data().name}
                    className="object-cover object-center w-full h-full lg:h-full lg:w-full"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between mt-4">
                    <div>
                      <h3 className="text-sm font-bold text-base-content">
                        <Link href={`/tree/${tree.id}`}>
                          {tree.data().name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-base-content opacity-70">
                        {tree.data().species} &middot; {tree.data().type}
                      </p>
                    </div>
                  </div>

                  {tree.data().adoptedBy ? (
                    <button className="btn btn-sm" disabled>
                      Adopted
                    </button>
                  ) : (
                    <div
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        adoptTree(
                          tree.id,
                          `https://gateway.pinata.cloud/ipfs/${
                            tree.data()?.ipfsHash
                          }`
                        );
                      }}
                    >
                      Adopt
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
