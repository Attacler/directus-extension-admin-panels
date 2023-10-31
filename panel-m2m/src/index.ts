import { definePanel } from "@directus/extensions-sdk";
import PanelComponent from "./panel.vue";

export default definePanel({
  id: "adminPanels-m2m",
  name: "Admin panels - empty M2M",
  icon: "box",
  description:
    "Showcases the empty M2M relations and allows you to easily delete them.",
  component: PanelComponent,
  options: [],
  minWidth: 24,
  minHeight: 10,
});
