import React from "react";
import CSS from "csstype";
import { Icon } from "@chakra-ui/icons";
import { FaAlignJustify } from "react-icons/fa";

const styles: CSS.Properties = {
  position: "fixed",
  width: "60px",
  height: "60px",
  bottom: "15px",
  left: "15px",
  backgroundColor: "#845ec2",
  color: "#fff",
  borderRadius: "50px",
  textAlign: "center",
  boxShadow: "2px 2px 3px rgb(15, 15, 15)",
  cursor: "pointer",
};

const FloatingButton = ({ showNavitation }: { showNavitation: () => void }) => {
  return (
    <div style={styles} onClick={showNavitation}>
      <Icon as={FaAlignJustify} w={5} h={5} mt="20px" />
    </div>
  );
};

export default FloatingButton;
