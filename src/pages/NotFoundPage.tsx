import { Button } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div>
      <div>NotFound</div>
      <NavLink to="/home">
        <Button>Back to Home</Button>
      </NavLink>
    </div>
  );
};

export default NotFoundPage;
