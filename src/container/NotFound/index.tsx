import { Button } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <div>NotFound</div>
      <NavLink to="/home">
        <Button>Back to Home</Button>
      </NavLink>
    </div>
  );
};

export default NotFound;
