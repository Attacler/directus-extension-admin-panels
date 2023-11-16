import { useApi, definePanel, useStores } from '@directus/extensions-sdk';
import { defineComponent, resolveComponent, openBlock, createElementBlock, normalizeClass, createVNode, withCtx, createTextVNode, toDisplayString, Fragment } from 'vue';

const BYTE_UNITS = [
	'B',
	'kB',
	'MB',
	'GB',
	'TB',
	'PB',
	'EB',
	'ZB',
	'YB',
];

const BIBYTE_UNITS = [
	'B',
	'KiB',
	'MiB',
	'GiB',
	'TiB',
	'PiB',
	'EiB',
	'ZiB',
	'YiB',
];

const BIT_UNITS = [
	'b',
	'kbit',
	'Mbit',
	'Gbit',
	'Tbit',
	'Pbit',
	'Ebit',
	'Zbit',
	'Ybit',
];

const BIBIT_UNITS = [
	'b',
	'kibit',
	'Mibit',
	'Gibit',
	'Tibit',
	'Pibit',
	'Eibit',
	'Zibit',
	'Yibit',
];

/*
Formats the given number using `Number#toLocaleString`.
- If locale is a string, the value is expected to be a locale-key (for example: `de`).
- If locale is true, the system default locale is used for translation.
- If no value for locale is specified, the number is returned unmodified.
*/
const toLocaleString = (number, locale, options) => {
	let result = number;
	if (typeof locale === 'string' || Array.isArray(locale)) {
		result = number.toLocaleString(locale, options);
	} else if (locale === true || options !== undefined) {
		result = number.toLocaleString(undefined, options);
	}

	return result;
};

function prettyBytes(number, options) {
	if (!Number.isFinite(number)) {
		throw new TypeError(`Expected a finite number, got ${typeof number}: ${number}`);
	}

	options = {
		bits: false,
		binary: false,
		space: true,
		...options,
	};

	const UNITS = options.bits
		? (options.binary ? BIBIT_UNITS : BIT_UNITS)
		: (options.binary ? BIBYTE_UNITS : BYTE_UNITS);

	const separator = options.space ? ' ' : '';

	if (options.signed && number === 0) {
		return ` 0${separator}${UNITS[0]}`;
	}

	const isNegative = number < 0;
	const prefix = isNegative ? '-' : (options.signed ? '+' : '');

	if (isNegative) {
		number = -number;
	}

	let localeOptions;

	if (options.minimumFractionDigits !== undefined) {
		localeOptions = {minimumFractionDigits: options.minimumFractionDigits};
	}

	if (options.maximumFractionDigits !== undefined) {
		localeOptions = {maximumFractionDigits: options.maximumFractionDigits, ...localeOptions};
	}

	if (number < 1) {
		const numberString = toLocaleString(number, options.locale, localeOptions);
		return prefix + numberString + separator + UNITS[0];
	}

	const exponent = Math.min(Math.floor(options.binary ? Math.log(number) / Math.log(1024) : Math.log10(number) / 3), UNITS.length - 1);
	number /= (options.binary ? 1024 : 1000) ** exponent;

	if (!localeOptions) {
		number = number.toPrecision(3);
	}

	const numberString = toLocaleString(Number(number), options.locale, localeOptions);

	const unit = UNITS[exponent];

	return prefix + numberString + separator + unit;
}

var script$1 = defineComponent({
  props: {
    showHeader: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    files: [],
    selected: [],
    deleting: false,
    deleteConfirm: false
  }),
  methods: {
    prettyBytes(size) {
      return prettyBytes(size);
    },
    openFile(id) {
      window.open("/admin/files/" + id, "_blank");
    },
    async removeAllFiles() {
      if (this.deleting)
        return;
      this.deleting = true;
      await this.api.delete("/files", { data: this.selected });
      this.selected = [];
      await this.loadFiles();
      this.deleting = false;
      this.deleteConfirm = false;
    },
    async loadFiles() {
      this.files = (await this.api.get("/adminPanels/files")).data;
    }
  },
  async mounted() {
    this.api = useApi();
    this.loadFiles();
  }
});

const _hoisted_1 = {
  key: 0,
  class: "loading"
};

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_v_button = resolveComponent("v-button");
  const _component_v_card_title = resolveComponent("v-card-title");
  const _component_v_card_actions = resolveComponent("v-card-actions");
  const _component_v_card = resolveComponent("v-card");
  const _component_v_dialog = resolveComponent("v-dialog");
  const _component_v_icon = resolveComponent("v-icon");
  const _component_v_table = resolveComponent("v-table");

  return (openBlock(), createElementBlock("div", {
    class: normalizeClass(["admin-panel", { 'has-header': _ctx.showHeader }])
  }, [
    createVNode(_component_v_button, {
      disabled: _ctx.selected.length == 0 || _ctx.deleting,
      id: "removeAllFiles",
      outlined: "",
      onClick: _cache[0] || (_cache[0] = $event => (_ctx.deleteConfirm = true))
    }, {
      default: withCtx(() => [
        createTextVNode(" Remove all (" + toDisplayString(_ctx.selected.length) + ") ", 1 /* TEXT */)
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["disabled"]),
    createVNode(_component_v_dialog, {
      modelValue: _ctx.deleteConfirm,
      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((_ctx.deleteConfirm) = $event)),
      onEsc: _cache[3] || (_cache[3] = $event => (_ctx.deleteConfirm = false))
    }, {
      default: withCtx(() => [
        createVNode(_component_v_card, null, {
          default: withCtx(() => [
            createVNode(_component_v_card_title, null, {
              default: withCtx(() => [
                createTextVNode("Are you sure that you want to delete " + toDisplayString(_ctx.selected.length) + " files?", 1 /* TEXT */)
              ]),
              _: 1 /* STABLE */
            }),
            createVNode(_component_v_card_actions, null, {
              default: withCtx(() => [
                createVNode(_component_v_button, {
                  secondary: "",
                  onClick: _ctx.removeAllFiles
                }, {
                  default: withCtx(() => [
                    (_ctx.deleting)
                      ? (openBlock(), createElementBlock("div", _hoisted_1))
                      : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                          createTextVNode("Yes")
                        ], 64 /* STABLE_FRAGMENT */))
                  ]),
                  _: 1 /* STABLE */
                }, 8 /* PROPS */, ["onClick"]),
                createVNode(_component_v_button, {
                  onClick: _cache[1] || (_cache[1] = $event => (_ctx.deleteConfirm = false))
                }, {
                  default: withCtx(() => [
                    createTextVNode("Cancel")
                  ]),
                  _: 1 /* STABLE */
                })
              ]),
              _: 1 /* STABLE */
            })
          ]),
          _: 1 /* STABLE */
        })
      ]),
      _: 1 /* STABLE */
    }, 8 /* PROPS */, ["modelValue"]),
    createVNode(_component_v_table, {
      headers: [
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
      ],
      items: _ctx.files,
      "show-select": "multiple",
      "selection-use-keys": "",
      "item-key": "id",
      sort: { by: 'filesize', desc: false },
      modelValue: _ctx.selected,
      "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((_ctx.selected) = $event))
    }, {
      [`item.filesize`]: withCtx(({ item }) => [
        createTextVNode(toDisplayString(_ctx.prettyBytes(item.filesize)), 1 /* TEXT */)
      ]),
      [`item-append`]: withCtx(({ item }) => [
        createVNode(_component_v_button, {
          icon: "",
          outlined: "",
          onClick: $event => (_ctx.openFile(item.id)),
          class: "open-in-new"
        }, {
          default: withCtx(() => [
            createVNode(_component_v_icon, { name: "open_in_new" })
          ]),
          _: 2 /* DYNAMIC */
        }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["onClick"])
      ]),
      _: 2 /* DYNAMIC */
    }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["items", "modelValue"])
  ], 2 /* CLASS */))
}

var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

var css$2 = "\n.admin-panel[data-v-96f513cc] {\n  overflow: auto;\n  position: relative;\n}\n.admin-panel.has-header[data-v-96f513cc] {\n  padding: 0 12px;\n}\n.admin-panel #removeAllFiles[data-v-96f513cc] {\n  position: absolute;\n  right: 24px;\n  z-index: 10;\n  top: 2px;\n}\n.open-in-new[data-v-96f513cc] {\n  padding-right: 5px;\n}\n.loading[data-v-96f513cc] {\n  cursor: not-allowed;\n  border: 2px solid transparent;\n  border-top: 2px solid var(--v-button-background-color);\n  border-radius: 50%;\n  width: 30px;\n  height: 30px;\n  animation: spin-96f513cc 2s linear infinite;\n  margin: 0 auto;\n  animation: spin-96f513cc 2s linear infinite;\n}\n@keyframes spin-96f513cc {\n0% {\n    transform: rotate(0deg);\n}\n100% {\n    transform: rotate(360deg);\n}\n}\n";
n(css$2,{});

var css$1 = "\n.panel-container:has(.admin-panel) {\n  overflow: auto;\n}\n";
n(css$1,{});

script$1.render = render$1;
script$1.__scopeId = "data-v-96f513cc";
script$1.__file = "panel-files/src/panel.vue";

var e0 = definePanel({
  id: "adminPanels-files",
  name: "Admin panels - view unlinked files",
  icon: "box",
  description: "Showcases all files that are not linked and allows you to easily delete them.",
  component: script$1,
  options: [],
  minWidth: 30,
  minHeight: 10
});

var script = defineComponent({
  props: {
    showHeader: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    m2mItems: [],
    collections: []
  }),
  methods: {
    async deleteItems(collection, ids) {
      if (this.deleting)
        return;
      this.deleting = true;
      await this.api.delete("/items/" + collection, {
        data: ids
      });
      console.log(collection, ids);
      this.deleting = false;
    }
  },
  async mounted() {
    this.api = useApi();
    const { useCollectionsStore } = useStores();
    this.collections = useCollectionsStore().collections;
    this.m2mItems = (await this.api.get("/adminPanels/m2m")).data;
  }
});

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_v_icon = resolveComponent("v-icon");
  const _component_v_button = resolveComponent("v-button");
  const _component_v_table = resolveComponent("v-table");

  return (openBlock(), createElementBlock("div", {
    class: normalizeClass(["text", { 'has-header': _ctx.showHeader }])
  }, [
    createVNode(_component_v_table, {
      headers: [
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
      ],
      items: 
        Object.keys(_ctx.m2mItems).map((collection) => ({
          collection,
          collectionName:
            _ctx.collections.find((e) => e.collection == collection)?.name ||
            'Unknown',
          ids: _ctx.m2mItems[collection],
        }))
      
    }, {
      [`item.size`]: withCtx(({ item }) => [
        createTextVNode(toDisplayString(item.ids.length), 1 /* TEXT */)
      ]),
      [`item-append`]: withCtx(({ item }) => [
        createVNode(_component_v_button, {
          icon: "",
          outlined: "",
          onClick: $event => (_ctx.deleteItems(item.collection, item.ids))
        }, {
          default: withCtx(() => [
            createVNode(_component_v_icon, { name: "delete" })
          ]),
          _: 2 /* DYNAMIC */
        }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["onClick"])
      ]),
      _: 2 /* DYNAMIC */
    }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["items"])
  ], 2 /* CLASS */))
}

var css = "\n.text[data-v-3ee0446a] {\n  padding: 12px;\n}\n.text.has-header[data-v-3ee0446a] {\n  padding: 0 12px;\n}\n";
n(css,{});

script.render = render;
script.__scopeId = "data-v-3ee0446a";
script.__file = "panel-m2m/src/panel.vue";

var e1 = definePanel({
  id: "adminPanels-m2m",
  name: "Admin panels - empty M2M",
  icon: "box",
  description: "Showcases the empty M2M relations and allows you to easily delete them.",
  component: script,
  options: [],
  minWidth: 24,
  minHeight: 10
});

const interfaces = [];const displays = [];const layouts = [];const modules = [];const panels = [e0,e1];const operations = [];

export { displays, interfaces, layouts, modules, operations, panels };
