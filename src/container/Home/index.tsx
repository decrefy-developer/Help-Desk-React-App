import React from "react";
import { Flex, useMediaQuery } from "@chakra-ui/react";
import { DecodeToken } from "../../utils/decode-token";
import SubBar from "./SubBar";
import { Outlet } from "react-router-dom";
import { IUser } from "../../models/interface";

const Home: React.FC = () => {
  const decoded: IUser | null = DecodeToken();

  const [isMobile] = useMediaQuery("(max-width: 600px)");

  return (
    <React.Fragment>
      {decoded?._id !== "" && (
        <SubBar isMobile={isMobile} userId={decoded ? decoded._id : ""} />
      )}
      <Flex w="full">
        <Flex w="full" flexDirection="column">
          <Outlet />
        </Flex>
      </Flex>
    </React.Fragment>
  );
};

export default Home;
