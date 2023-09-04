import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import Header from "@/components/Header.jsx";
import { IconCopy } from "@tabler/icons-react";
import { IconRefresh } from "@tabler/icons-react";
import { useSensorStore } from "@/store/sensor-data";
import { useRouter } from "next/router";
import { IconAlertCircle } from "@tabler/icons-react";

export default function Transactions() {
  const router = useRouter();
  const id = router.query.id ?? "";

  const sensorStore = useSensorStore();

  function addData() {
    const sampleStatuses = ["Growing"];

    const data = {
      id: Math.floor(Math.random() * 100),
      status: sampleStatuses[Math.floor(Math.random() * sampleStatuses.length)],
    };

    sensorStore.updateSensor(id, data);

    console.log(data);
  }

  return (
    <>
      <Header title={`Sensor ${id}`} />

      <div className="container mx-auto mt-12 px-4 sm:px-6 lg:px-8">
        {!sensorStore.data[id] ? (
          <div className="flex items-center gap-2 justify-center min-h-[200px] rounded bg-error text-error-content">
            <IconAlertCircle />
            <h2 className="text-xl flex items-center">Sensor Not Found</h2>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4 gap-4">
              <button
                onClick={addData}
                className="flex bg-secondary px-4 py-2 rounded"
              >
                <IconRefresh />
                <span>Refresh</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="table w-full table-compact">
                <thead>
                  <th>ID</th>
                  <th>Status</th>
                </thead>
                <tbody>
                  {Object.entries(sensorStore.data[id]).map(([id, data]) => (
                    <tr key={id}>
                      <th>{data.id}</th>
                      <td>{data.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
