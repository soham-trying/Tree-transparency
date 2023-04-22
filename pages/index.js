import { IconTrees } from "@tabler/icons-react";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-full gap-5">
        <IconTrees size={100} className="text-emerald-500" />
        <h4 className="text-xl">
          A Web 3.0 Platform for maintaining Tree Transparency
        </h4>
        <h1 className="text-6xl font-bold">Tree Transparency</h1>
        <h2 className="text-4xl">Maintain Trees Around You</h2>
      </div>
    </>
  );
}
