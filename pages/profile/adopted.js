import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { auth, firestore } from "@/services/firebase";
import Image from "next/image";
import { collection, query, where } from "firebase/firestore";
import {
  useCollectionOnce,
  useDocumentOnce,
} from "react-firebase-hooks/firestore";
import { useEffect } from "react";
import { useUserStore } from "@/store/user";
import { useUserContext } from "@/services/userContext";
import Link from "next/link";
import {
  IconCircleCheck,
  IconCircleX,
  IconExternalLink,
} from "@tabler/icons-react";

export default function AdoptedTree() {
  const { userStore } = useUserStore();
  const [trees, loadingTrees, errorTrees, reloadTrees] = useCollectionOnce(
    collection(firestore, "Trees")
  );

  return (
    <>
      <Header title="Adopted Trees" />

      <div className="container mx-auto">
        {loadingTrees && <Loading />}
        <div className="grid grid-cols-1 mt-6 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {!trees && !loadingTrees && "No Results Found"}
          {trees &&
            userStore &&
            trees.docs
              .filter((tree) => tree.data().adoptedBy === userStore.email)
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
                      <div className="flex gap-2">
                        {tree.data().isVerified ? (
                          <button className="btn btn-success btn-circle">
                            <IconCircleCheck />
                          </button>
                        ) : (
                          <button
                            className="btn btn-error btn-circle"
                            onClick={() => verifyTree(tree.id)}
                          >
                            <IconCircleX />
                          </button>
                        )}
                        <Link
                          href={`/tree/${tree.id}`}
                          className="btn btn-circle btn-md"
                        >
                          <IconExternalLink />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </>
  );
}
