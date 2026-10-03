// eslint-disable-next-line import/no-unassigned-import -- required to augment the styled-components module
import "styled-components";
import type { Theme } from "react95/dist/types";

declare module "styled-components" {
  // Augment styled-components' DefaultTheme with the react95 theme shape so
  // styled components can read theme values like `theme.materialText`.
  export interface DefaultTheme extends Theme {}
}
