import { definePanel } from "@directus/extensions-sdk";
import PanelComponent from "./panel.vue";

export default definePanel({
  id: "adminPanels-files",
  name: "Admin panels - view unlinked files",
  icon: "box",
  description:
    "Showcases all files that are not linked and allows you to easily delete them.",
  component: PanelComponent,
  options: [],
  minWidth: 30,
  minHeight: 10,
});
