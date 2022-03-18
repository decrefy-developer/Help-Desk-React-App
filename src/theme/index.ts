import {
  extendTheme,
  theme as base,
  withDefaultColorScheme,
  withDefaultVariant,
} from "@chakra-ui/react";
import { ButtonStyle } from "./Button";
import { CheckboxStyle } from "./Checkbox";
import { HeadingStyle } from "./Heading";
import { InpuStyle } from "./Input";
import { RadioStyle } from "./Radio";
import { SelectStyle } from "./Select";

const theme = extendTheme(
  {
    colors: {
      primary: "#845ec2",
      secondary: "#a178df",
      accent: "#d65db1",
      secondAccent: "#47B9B0",
      warning: "#eed202",
      danger: "#F56565",
      success: "#48BB78",
      brand: {
        50: "#f5fee5",
        100: "#e1fbb2",
        200: "#cdf781",
        300: "#b8ee56",
        400: "#a2e032",
        500: "#8ac919",
        600: "#71ab09",
        700: "#578602",
        800: "#3c5e00",
        900: "#203300",
      },
    },
    fonts: {
      heading: `Montserrat, ${base.fonts?.heading}`,
      body: `Inter, ${base.fonts?.body}`,
    },
    components: {
      Heading: { ...HeadingStyle },
      Input: { ...InpuStyle },
      Button: { ...ButtonStyle },
      Checkbox: { ...CheckboxStyle },
      Select: { ...SelectStyle },
      Radio: { ...RadioStyle },
    },
  },
  withDefaultColorScheme({
    colorScheme: "purple",
    components: ["Input", "Checkbox"],
  }),
  withDefaultVariant({
    variant: "filled",
    components: ["Input", "Select", "Textarea"],
  })
);

export default theme;
