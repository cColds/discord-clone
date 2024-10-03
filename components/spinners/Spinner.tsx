import { useEffect } from "react";

const Spinner = () => {
  useEffect(() => {
    const getLoader = async () => {
      const { ring2 } = await import("ldrs");
      ring2.register();
    };

    getLoader();
  }, []);

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
