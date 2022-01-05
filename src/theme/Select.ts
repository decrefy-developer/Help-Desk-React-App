export const SelectStyle = {
  // style object for base or default style
  baseStyle: {},
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {
    filled: {
      field: {
        borderRadius: "2px",
        _focus: {
          borderColor: "purple.500",
        },
        _active: {
          borderColor: "purple.500",
        },
      },
    },
  },
  // default values for `size` and `variant`
  defaultProps: {},
};
