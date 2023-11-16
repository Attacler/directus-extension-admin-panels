'use strict';

var e0 = {
  id: "adminPanels",
  handler: (router, { services }) => {
    router.get("/m2m", async (_req, res) => {
      const { accountability, schema } = _req;
      if (accountability.admin != true) {
        res.status(403);
        return res.send(`You don't have permission to access this.`);
      }
      const checkedRelations = [];
      const collectionsWith2Relations = schema.relations.filter(({ collection }) => {
        if (checkedRelations.indexOf(collection) != -1)
          return false;
        const filter = schema.relations.filter((e) => e.collection == collection).length == 2;
        if (filter == true)
          checkedRelations.push(collection);
        return filter;
      }).map((e) => e.collection);
      let itemsIDsPerCollection = {};
      for (const collectionName of collectionsWith2Relations) {
        const collection = schema.collections[collectionName];
        const fieldsArray = Object.values(collection.fields).filter(
          (e) => e.field != collection.primary
        );
        const nonRelationalFields = fieldsArray.filter(
          (e) => !isRelation(schema, collectionName, e.field)
        );
        if (nonRelationalFields.length > 0)
          continue;
        const relationalFields = fieldsArray.filter((e) => isRelation(schema, collectionName, e.field)).map((e) => e.field);
        const service = new services.ItemsService(collectionName, { schema });
        const filterObject = [];
        for (const field of relationalFields) {
          filterObject.push({ [field]: { _null: true } });
        }
        const getItems = await service.readByQuery({
          filter: { _or: filterObject },
          fields: [collection.primary]
        });
        if (getItems.length > 0) {
          itemsIDsPerCollection[collectionName] = getItems.map(
            (e) => e[collection.primary]
          );
        }
      }
      res.json(itemsIDsPerCollection);
    });
    router.get("/files", async (_req, res) => {
      const { accountability, schema } = _req;
      if (accountability.admin != true) {
        res.status(403);
        return res.send(`You don't have permission to access this.`);
      }
      const fileRelations = schema.relations.filter(
        (e) => e.related_collection == "directus_files"
      );
      const filesService = new services.FilesService({ schema });
      const fileIDs = await filesService.readByQuery({
        fields: ["id", "title", "filesize"],
        limit: -1
      });
      for (const file of fileIDs)
        file.filesize = parseInt(file.filesize);
      const groupedRelations = {};
      for (const { collection, field } of fileRelations) {
        if (groupedRelations[collection] == null)
          groupedRelations[collection] = [];
        groupedRelations[collection].push(field);
      }
      for (const collection in groupedRelations) {
        const fields = groupedRelations[collection];
        const service = new services.ItemsService(collection, { schema });
        const getItems = await service.readByQuery({
          fields,
          limit: -1
        });
        for (const item of getItems) {
          for (const field of fields) {
            if (item[field] != null) {
              const index = fileIDs.findIndex(
                (e) => e.id == item[field]
              );
              if (index != -1) {
                fileIDs.splice(index, 1);
              }
            }
          }
        }
      }
      res.json(fileIDs);
    });
  }
};
function isRelation(schema, collectionName, field) {
  return schema.relations.find(
    (rel) => rel.collection == collectionName && rel.field == field
  ) != null;
}

const hooks = [];const endpoints = [{name:'endpoints',config:e0}];const operations = [];

exports.endpoints = endpoints;
exports.hooks = hooks;
exports.operations = operations;
