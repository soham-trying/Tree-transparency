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
          className="flex flex-col items-center justify-center w-full max-w-4xl gap-5 px-4"
        >
          <div className="w-full form-control">
            <label htmlFor="username" className="label">
              {watch("type") === "NGOs"
                ? "NGO Name"
                : watch("type") === "Private Companies"
                ? "Company Name"
                : "Username"}
            </label>
            <input className="input input-bordered" {...register("username")} />
          </div>

          <div className="w-full form-control">
            <label htmlFor="pinCode" className="label">
              Pin Code
            </label>
            <input className="input input-bordered" {...register("pinCode")} />
          </div>

          <div className="w-full form-control">
            <label htmlFor="phone" className="label">
              Phone
            </label>
            <input className="input input-bordered" {...register("phone")} />
          </div>

          <div className="w-full form-control">
            <label htmlFor="type" className="label">
              Type
            </label>
            <select className="select select-bordered" {...register("type")}>
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
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </GuardedPage>
  );
}

function VolunteerFields({ register, ngos }) {
  return (
    <>
      <div className="w-full form-control">
        <label htmlFor="volunteerNgo">NGO</label>
        <select
          {...register("volunteerNgo")}
          className="select select-bordered"
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
        <label htmlFor="ngoId" className="label">
          NGO Id
        </label>
        <input
          {...register("ngoId")}
          type="text"
          className="input input-bordered"
        />
      </div>

      <div className="w-full form-control">
        <label htmlFor="ngoAddress" className="label">
          NGO Address
        </label>
        <input
          {...register("ngoAddress")}
          type="text"
          className="input input-bordered"
        />
      </div>
    </>
  );
}
