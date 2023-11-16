<template>
  <div class="admin-panel" :class="{ 'has-header': showHeader }">
    <v-button
      :disabled="selected.length == 0 || deleting"
      id="removeAllFiles"
      outlined
      @click="deleteConfirm = true"
    >
      Remove all ({{ selected.length }})
    </v-button>
    <v-dialog v-model="deleteConfirm" @esc="deleteConfirm = false">
      <v-card>
        <v-card-title
          >Are you sure that you want to delete
          {{ selected.length }} files?</v-card-title
        >
        <v-card-actions>
          <v-button secondary @click="removeAllFiles"
            ><div class="loading" v-if="deleting" />
            <template v-else>Yes</template>
          </v-button>
          <v-button @click="deleteConfirm = false">Cancel</v-button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-table
      :headers="[
        {
          text: 'Filename',
          value: 'title',
          width: 300,
          sortable: false,
        },
        {
          text: 'Size',
          value: 'filesize',
          width: 175,
          sortable: false,
        },
      ]"
      :items="files"
      show-select="multiple"
      selection-use-keys
      item-key="id"
      :sort="{ by: 'filesize', desc: false }"
      v-model="selected"
    >
      <template #[`item.filesize`]="{ item }">
        {{ prettyBytes(item.filesize) }}
      </template>
      <template #[`item-append`]="{ item }">
        <v-button icon outlined @click="openFile(item.id)" class="open-in-new">
          <v-icon name="open_in_new" />
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
    selected: [],
    deleting: false,
    deleteConfirm: false,
  }),
  methods: {
    prettyBytes(size: number) {
      return prettyBytes(size);
    },
    openFile(id: string) {
      window.open("/admin/files/" + id, "_blank");
    },
    async removeAllFiles() {
      if (this.deleting) return;
      this.deleting = true;
      await this.api.delete("/files", { data: this.selected });

      this.selected = [];
      await this.loadFiles();
      this.deleting = false;
      this.deleteConfirm = false;
    },
    async loadFiles() {
      this.files = (await this.api.get("/adminPanels/files")).data;
    },
  },
  async mounted() {
    this.api = useApi();
    this.loadFiles();
  },
});
</script>

<style scoped>
.admin-panel {
  overflow: auto;
  position: relative;
}

.admin-panel.has-header {
  padding: 0 12px;
}

.admin-panel #removeAllFiles {
  position: absolute;
  right: 24px;
  z-index: 10;
  top: 2px;
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
