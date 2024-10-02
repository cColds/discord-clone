import { ring2 } from "ldrs";
import "ldrs/ring2";

const Spinner = () => {
  ring2.register();

  return (
    <l-ring-2
      size="24"
      stroke="4"
      stroke-length="0.25"
      bg-opacity="0.1"
      speed="0.8"
      color="white"
    ></l-ring-2>
  );
};

export default Spinner;
