<template>
  <div class="text" :class="{ 'has-header': showHeader }">
    <v-table
      :headers="[
        {
          text: 'Collection',
          value: 'collectionName',
          width: 300,
        },
        {
          text: 'Amount of records',
          value: 'size',
          width: 175,
        },
      ]"
      :items="
        Object.keys(m2mItems).map((collection) => ({
          collection,
          collectionName:
            collections.find((e) => e.collection == collection)?.name ||
            'Unknown',
          ids: m2mItems[collection],
        }))
      "
    >
      <template #[`item.size`]="{ item }">
        {{ item.ids.length }}
      </template>
      <template #[`item-append`]="{ item }">
        <v-button icon outlined @click="deleteItems(item.collection, item.ids)">
          <v-icon name="delete" />
        </v-button>
      </template>
    </v-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useApi, useStores } from "@directus/extensions-sdk";

export default defineComponent({
  props: {
    showHeader: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    m2mItems: [],
    collections: [],
  }),
  methods: {
    async deleteItems(collection: string, ids: string[]) {
      if (this.deleting) return;
      this.deleting = true;

      await this.api.delete("/items/" + collection, {
        data: ids,
      });

      console.log(collection, ids);

      this.deleting = false;
    },
  },
  async mounted() {
    this.api = useApi();
    const { useCollectionsStore } = useStores();
    this.collections = useCollectionsStore().collections;
    
    this.m2mItems = (await this.api.get("/adminPanels/m2m")).data;
  },
});
</script>

<style scoped>
.text {
  padding: 12px;
}

.text.has-header {
  padding: 0 12px;
}
</style>
