import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Vibrant from "node-vibrant";

type ProfileBannerProps = {
  className?: string;
  viewBox: "0 0 300 105" | "0 0 660 100" | "0 0 340 120" | "0 0 600 210";
  previewProfile?: boolean;
  userProfile?: boolean;
  url: string;
};

export const ProfileBanner = ({
  className,
  viewBox,
  previewProfile = false,
  userProfile = false,
  url,
}: ProfileBannerProps) => {
  const uuid = uuidv4();
  const [imgColor, setImgColor] = useState("#020617");

  useEffect(() => {
    if (url) {
      Vibrant.from(url)
        .getPalette()
        .then((palette) => {
          if (palette.LightVibrant) {
            setImgColor(palette.LightVibrant.hex);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [url]);

  return (
    <svg className={className} viewBox={viewBox}>
      <mask id={uuid}>
        <rect fill="white" x="0" y="0" width="100%" height="100%"></rect>
        {previewProfile ? (
          <circle fill="black" cx="56" cy="101" r="46"></circle>
        ) : userProfile ? (
          <circle fill="black" cx="84" cy="205" r="68"></circle>
        ) : (
          <circle fill="black" cx="62" cy="122" r="46"></circle>
        )}
        {/* should use if its dm sidebar profile <circle fill="black" cx="56" cy="112" r="46"></circle> */}

        {/* todo: banner size preset like small, med, xl */}
      </mask>
      <foreignObject
        x="0"
        y="0"
        width="100%"
        height="100%"
        overflow="visible"
        mask={`url(#${uuid})`}
      >
        <div
          className={`${userProfile ? "h-[210px]" : "h-[105px]"}`}
          style={{ backgroundColor: imgColor }}
        />
      </foreignObject>
    </svg>
  );
};
