import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  getDocs,
  query,
  collection,
  where,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import { userType } from "@/constants/user-type";
import { useUserContext } from "@/services/userContext";
import { firestore } from "@/services/firebase";
import { useUserStore } from "@/store/user";
import GuardedPage from "@/components/GuardedPage";

export default function EditProfile() {
  const router = useRouter();

  const { user, changeDisplayName } = useUserContext();
  const { userStore, setUser } = useUserStore();
  const [ngos, setNgos] = useState([]);

  const { register, handleSubmit, setValue, watch } = useForm();

  useEffect(() => {
    // !user && router.push("/login");

    if (user) {
      const docRef = doc(firestore, "Users", user.email);
      const docSnap = getDoc(docRef)
        .then(async (docSnap) => {
          setValue("email", user.email ?? "");

          if (docSnap.exists()) {
            let userData = docSnap.data();

            setValue("username", userData.username ?? "");
            setValue("phone", userData.phone ?? "");
            setValue("pinCode", userData.pinCode ?? "");
            userData.type && setValue("type", userData.type ?? "");

            await fetchNgos();

            if (userData.type === "Volunteers") {
              setValue("volunteerNgo", userData.volunteerNgo ?? "");
            }

            if (userData.type === "NGOs") {
              setValue("ngoId", userData.ngoId ?? "");
              setValue("ngoAddress", userData.ngoAddress ?? "");
            }
          }
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  async function fetchNgos() {
    const ngoRef = collection(firestore, "Users");
    const ngosSnap = await getDocs(query(ngoRef, where("type", "==", "NGOs")));

    const ngos = [];

    ngosSnap.forEach((doc) => {
      ngos.push({ id: doc.id, ...doc.data() });
    });

    setNgos(ngos);
  }

  const onSubmit = async (data) => {
    const { email, ...rest } = data;

    await changeDisplayName(data.username);
    console.log(email);

    const docRef = doc(firestore, "Users", email);

    const user = await getDoc(docRef);

    if (!user.exists())
      await setDoc(docRef, {
        ...rest,
        lastUpdated: serverTimestamp(),
      });
    else
      await updateDoc(docRef, {
        ...rest,
        lastUpdated: serverTimestamp(),
      });

    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return;

    setUser({ id: docSnap.id, ...docSnap.data() });

    router.push("/profile");
  };

  return (
    <GuardedPage>
  <div className="container w-full mx-auto">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center w-full max-w-4xl gap-5 p-5 my-10 mx-auto shadow-xl rounded bg-white"
    >
      <div className="w-full form-control">
        <label htmlFor="username" className="label text-gray-800 font-medium">
          {watch("type") === "NGOs"
            ? "NGO Name"
            : watch("type") === "Private Companies"
            ? "Company Name"
            : "Username"}
        </label>
        <input
          className="input input-bordered mt-1"
          {...register("username")}
        />
      </div>

      <div className="w-full form-control">
        <label htmlFor="pinCode" className="label text-gray-800 font-medium">
          Pin Code
        </label>
        <input className="input input-bordered mt-1" {...register("pinCode")} />
      </div>

      <div className="w-full form-control">
        <label htmlFor="phone" className="label text-gray-800 font-medium">
          Phone
        </label>
        <input className="input input-bordered mt-1" {...register("phone")} />
      </div>

      <div className="w-full form-control">
        <label htmlFor="type" className="label text-gray-800 font-medium">
          Type
        </label>
        <select
          className="select select-bordered mt-1"
          {...register("type")}
        >
          {userType.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {watch("type") === "NGOs" && <NGOFields register={register} />}
      {watch("type") === "Volunteers" && (
        <VolunteerFields register={register} ngos={ngos} />
      )}

      <div className="w-full form-control">
        <button
          type="submit"
          className="btn btn-primary bg-primary text-white hover:bg-primary-dark"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</GuardedPage>
);

function VolunteerFields({ register, ngos }) {
  return (
    <>
      <div className="w-full form-control">
        <label htmlFor="volunteerNgo" className="label text-gray-800 font-medium">
          NGO
        </label>
        <select
          {...register("volunteerNgo")}
          className="select select-bordered mt-1"
        >
          {ngos.map((ngo) => (
            <option key={ngo.id}>{ngo.username}</option>
          ))}
        </select>
      </div>
    </>
  );
}

function NGOFields({ register }) {
  return (
    <>
      <div className="w-full form-control">
        <label htmlFor="ngoId" className="label text-gray-800 font-medium">
          NGO Id
        </label>
        <input
          {...register("ngoId")}
          type="text"
          className="input input-bordered mt-1"
        />
      </div>

      <div className="w-full form-control">
        <label htmlFor="ngoAddress" className="label text-gray-800 font-medium">
          NGO Address
        </label>
        <input
          {...register("ngoAddress")}
          type="text"
          className="input input-bordered mt-1"
        />
        </div>
      <div className="w-full form-control">
        <label htmlFor="ngoPhone" className="label text-gray-800 font-medium">
          NGO Phone
        </label>
        <input
          {...register("ngoPhone")}
          type="text"
          className="input input-bordered mt-1"
        />
      </div>
      <div className="w-full form-control">
    <label htmlFor="ngoEmail" className="label text-gray-800 font-medium">
      NGO Email
    </label>
    <input
      {...register("ngoEmail")}
      type="email"
      className="input input-bordered mt-1"
    />
  </div>

  <div className="w-full form-control">
    <label htmlFor="ngoWebsite" className="label text-gray-800 font-medium">
      NGO Website
    </label>
    <input
      {...register("ngoWebsite")}
      type="text"
      className="input input-bordered mt-1"
    />
  </div>
</>
        
    );
}

}
