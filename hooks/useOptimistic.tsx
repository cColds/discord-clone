import { useEffect, useState } from "react";

// Need to use custom hook to fix message not showing after server fetches message
// https://github.com/vercel/next.js/issues/49619
export default function useOptimistic<T>(passthrough: T) {
  const [value, setValue] = useState<T>(passthrough);

  useEffect(() => {
    setValue(passthrough);
  }, [passthrough]);

  return [value, setValue] as const;
}
