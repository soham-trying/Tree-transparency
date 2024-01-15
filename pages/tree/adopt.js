import { useEffect, useState } from "react";
import {
  getDoc,
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
  // const [trees, setTrees] = useState([]);
  const [trees, loadingTrees, errorTrees, reloadTrees] = useCollectionOnce(
    collection(firestore, "Trees")
  );

  const { user } = useUserContext();

  const adoptTree = async (id) => {
    // Create Contract
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // await provider.send("eth_requestAccounts", []);
    // const signer = provider.getSigner();

    // const contract = new ethers.Contract(
    //   treeContractAddress,
    //   TreeToken.abi,
    //   signer
    // );
    // const connection = contract.connect(signer);
    // const anotherResult = await result.wait();
    // console.log(anotherResult);

    const treeDocRef = doc(firestore, "Trees", id);
    const treeSnapshot = await getDoc(treeDocRef);
    const treeData = treeSnapshot.data();

    //Not allowing user to readopt previously owned tree
    const prevOwner = treeData?.prevOwner || [];
    const prevOwnerEmails = prevOwner.map(reference => reference.id);
    console.log(prevOwnerEmails);

    if(prevOwnerEmails.includes(user.email)){
      console.log("User cannot readopt a tree that they previously adopted.");
      alert("You had previously adopted this tree");
    }else{
      await updateDoc(treeDocRef, {
        isAdopted: true,
        adoptedBy: doc(firestore, `Users/${user.email}`),
      });
      reloadTrees();
      alert("Adopted Tree");
    }
  };

  return (
    <>
      <Head>
        <title>Adopt Trees</title>
      </Head>
      <div className="container py-6 mx-auto px-4 sm:px-6 lg:px-8">
        {loadingTrees ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 mt-6 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {errorTrees && <strong>Error: {JSON.stringify(error)}</strong>}
            {trees &&
              trees.docs
                .filter((tree) => !tree.data().adoptedBy && tree.data().isVerified)
                .map((tree) => (
                  <div key={tree.id}>
                    <div className="w-full overflow-hidden duration-200 bg-gray-200 rounded-md min-h-80 aspect-h-1 aspect-w-1 lg:aspect-none group-hover:opacity-75 lg:h-80">
                      <Image
                        width={200}
                        height={320}
                        src={tree.data().imageUrl}
                        alt={tree.data().name}
                        className="object-cover object-center w-full h-full lg:h-full lg:w-full"
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex justify-between mt-4">
                        <div>
                          <h3 className="font-bold text-md text-base-content">
                            <div>{tree.data().name}</div>
                          </h3>
                          <p className="mt-1 text-sm text-base-content opacity-70">
                            {tree.data().species} &middot; {tree.data().type}
                          </p>
                        </div>
                        <div>
                          <Link
                            href={`/tree/${tree.id}`}
                            className="btn btn-circle btn-md"
                          >
                            <IconExternalLink />
                          </Link>
                        </div>
                      </div>
                      {tree.data().adoptedBy ? (
                        <button className="btn" disabled>
                          Adopted
                        </button>
                      ) : (
                        <button
                          onClick={() => adoptTree(tree.id)}
                          className="btn btn-primary"
                        >
                          Adopt
                        </button>
                      )}
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>
    </>
  );
}
