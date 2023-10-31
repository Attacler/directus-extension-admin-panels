<template>
  <div class="admin-panel" :class="{ 'has-header': showHeader }">
    <v-table
      :headers="[
        {
          text: 'Filename',
          value: 'title',
          width: 300,
          sortable: true,
        },
        {
          text: 'Size',
          value: 'filesize',
          width: 175,
          sortable: true,
        },
      ]"
      :items="files"
    >
      <template #[`item.filesize`]="{ item }">
        {{ prettyBytes(item.filesize) }}
      </template>
      <template #[`item-append`]="{ item }">
        <v-button icon outlined @click="openFile(item.id)" class="open-in-new">
          <v-icon name="open_in_new" />
        </v-button>
        <v-button icon outlined @click="deleteFile(item.id)">
          <div class="loading" v-if="deleting" />
          <v-icon name="delete" v-else />
        </v-button>
      </template>
    </v-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useApi, useStores } from "@directus/extensions-sdk";
import prettyBytes from "pretty-bytes";

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
    files: [],
    collections: [],
    deleting: false,
  }),
  methods: {
    prettyBytes(size: number) {
      return prettyBytes(size);
    },
    openFile(id: string) {
      window.open("/admin/files/" + id, "_blank");
    },
    async deleteFile(id: string[]) {
      if (this.deleting) return;
      this.deleting = true;

      await this.api.delete("/files/" + id);
      const index = this.files.findIndex((file) => file.id == id);

      this.files.splice(index, 1);
      this.deleting = false;
    },
  },
  async mounted() {
    this.api = useApi();
    const { useCollectionsStore } = useStores();
    this.collections = useCollectionsStore().collections;

    this.files = (await this.api.get("/adminPanels/files")).data;
  },
});
</script>

<style scoped>
.admin-panel {
  overflow: auto;
}

.admin-panel.has-header {
  padding: 0 12px;
}

.open-in-new {
  padding-right: 5px;
}

.loading {
  cursor: not-allowed;
  border: 2px solid transparent;
  border-top: 2px solid var(--v-button-background-color);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 2s linear infinite;
  margin: 0 auto;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<style>
.panel-container:has(.admin-panel) {
  overflow: auto;
}
</style>
