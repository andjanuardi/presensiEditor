import { FaKey } from "react-icons/fa6";

export default function Token() {
  return (
    <div className="flex flex-col gap-3 h-full">
      <span className="flex gap-2 text-lg font-black items-center">
        <FaKey /> TOKEN
      </span>
      <textarea className="textarea textarea-bordered flex-1" />
      <button className="btn">Update Token</button>
    </div>
  );
}
