import { MessageImage } from "@/types/message";

export const createImageGroups = (images: MessageImage[]) => {
  const groups: MessageImage[][] = [];

  const numberOfImages = images.length;

  if (numberOfImages <= 4) {
    // Grouping for 1x1, 1x2, or 2x2 layout
    const firstGroup = images.slice(0, 2);
    const secondGroup = numberOfImages > 2 ? images.slice(2, 4) : [];

    groups.push(firstGroup);
    if (secondGroup.length > 0) {
      groups.push(secondGroup);
    }
  } else if (numberOfImages <= 6) {
    // Grouping for 2x3 or 3x3 layout
    const firstGroup = images.slice(0, 3);
    const secondGroup = numberOfImages > 3 ? images.slice(3, 6) : [];

    groups.push(firstGroup);
    if (secondGroup.length > 0) {
      groups.push(secondGroup);
    }
  } else {
    // Grouping for 3x4 or larger layout
    const imagesPerGroup = 3;
    for (let i = 0; i < numberOfImages; i += imagesPerGroup) {
      const group = images.slice(i, i + imagesPerGroup);
      groups.push(group);
    }
  }

  return groups;
};
