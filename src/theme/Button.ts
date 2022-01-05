import { mode } from "@chakra-ui/theme-tools";

export const ButtonStyle = {
  baseStyle: {
    borderRadius: "none",
    _focus: {
      ring: 2,
      ringColor: "purple.500",
    },
  },
  sizes: {},
  variants: {
    solid: (props: any) => ({
      color: mode("white", "gray.800")(props),

      _focus: {
        ring: 2,
        borderRadius: "none",
        ringColor: "purple.500",
      },

      _hover: {
        backgroundColor: mode("purple.600", "purple.400")(props),
      },

      _active: {
        backgroundColor: mode("purple.700", "purple.500")(props),
      },
    }),
  },
  defaultProps: {},
};
