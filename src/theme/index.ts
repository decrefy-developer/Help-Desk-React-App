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
      warning: "#eed202",
      danger: "#F56565",
      success: "#48BB78",
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
