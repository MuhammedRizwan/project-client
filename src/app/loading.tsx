import {Spinner} from "@nextui-org/react";

export default function Spinnerpage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center items-center">
      <Spinner label="Loading..." color="danger" />
      </div>
    </div>
  );
}