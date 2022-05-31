import CSS from 'csstype';
import { Icon } from '@chakra-ui/icons';
import { FaAlignJustify, FaPlus } from 'react-icons/fa';

const burgerStyle: CSS.Properties = {
  position: 'fixed',
  width: '60px',
  height: '60px',
  bottom: '90px',
  right: '15px',
  backgroundColor: '#845ec2',
  color: '#fff',
  borderRadius: '50px',
  textAlign: 'center',
  boxShadow: '2px 2px 3px rgb(15, 15, 15)',
  cursor: 'pointer',
};

const AddButtonStyle: CSS.Properties = {
  position: 'fixed',
  width: '60px',
  height: '60px',
  bottom: '15px',
  right: '15px',
  backgroundColor: '#845ec2',
  color: '#fff',
  borderRadius: '50px',
  textAlign: 'center',
  boxShadow: '2px 2px 3px rgb(15, 15, 15)',
  cursor: 'pointer',
};

export const BurgerFloatingButton = ({
  showNavitation,
}: {
  showNavitation: () => void;
}) => {
  return (
    <div style={burgerStyle} onClick={showNavitation}>
      <Icon as={FaAlignJustify} w={5} h={5} mt="20px" />
    </div>
  );
};

export const AddFloatingButton = ({
  openDrawer,
}: {
  openDrawer: () => void;
}) => {
  return (
    <div style={AddButtonStyle} onClick={openDrawer}>
      <Icon as={FaPlus} w={5} h={5} mt="20px" />
    </div>
  );
};
