import { IconLoader2 } from "@tabler/icons-react";

export default function Loading() {
  return (
    <div className="grid h-full place-items-center">
      <IconLoader2 size={100} className="animate-spin" />
    </div>
  );
}
