import { mode } from "@chakra-ui/theme-tools";

export const HeadingStyle = {
  baseStyle: {},
  sizes: {},
  variants: {
    solid: (props: any) => ({
      color: mode("gray.700", "white")(props),
    }),
  },
  defaultProps: {},
};
