import { Skeleton } from "@chakra-ui/react";
import React from "react";

const SkeletonPlaceHolder: React.FC<{ count: number }> = ({ count }) => {
  const items = [];

  for (let index = 0; index < count; index++) {
    items.push(<Skeleton height="30px" key={index} />);
  }

  return <>{items}</>;
};

export default SkeletonPlaceHolder;
