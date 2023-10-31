import Express from "express";

type relation = {
  collection: string;
  field: string;
  related_collection: string;
};
type collection = {
  collection: string;
  primary: string;
  singleton: false;
  note: null;
  sortField: null;
  accountability: string;
  fields: {
    field: string;
  }[];
};

type schema = {
  relations: relation[];
  collections: { [key: string]: collection };
};

export default {
  id: "adminPanels",
  handler: (router: Express.Router, { services }: any) => {
    router.get("/m2m", async (_req: Express.Request, res) => {
      const { accountability, schema } = _req as any as {
        accountability: any;
        schema: schema;
      };

      if (accountability.admin != true) {
        res.status(403);
        return res.send(`You don't have permission to access this.`);
      }

      const checkedRelations: string[] = [];

      const collectionsWithAtleast2Relations = schema.relations
        .filter(({ collection }: relation) => {
          if (checkedRelations.indexOf(collection) != -1) return false;

          const filter =
            schema.relations.filter((e: relation) => e.collection == collection)
              .length > 1;

          if (filter == true) checkedRelations.push(collection);

          return filter;
        })
        .map((e: relation) => e.collection);

      let itemsIDsPerCollection: { [key: string]: string | number } = {};

      for (const collectionName of collectionsWithAtleast2Relations) {
        const collection = schema.collections[collectionName] as collection;
        const fieldsArray = Object.values(collection.fields).filter(
          (e) => e.field != collection.primary
        );

        const nonRelationalFields = fieldsArray.filter(
          (e) => !isRelation(schema, collectionName, e.field)
        );

        if (nonRelationalFields.length > 0) continue;

        const relationalFields = fieldsArray
          .filter((e) => isRelation(schema, collectionName, e.field))
          .map((e) => e.field);

        const service = new services.ItemsService(collectionName, { schema });

        const filterObject: { [key: string]: { _null: true } }[] = [];

        for (const field of relationalFields) {
          filterObject.push({ [field]: { _null: true } });
        }

        const getItems = await service.readByQuery({
          filter: { _or: filterObject },
          fields: [collection.primary],
        });

        if (getItems.length > 0) {
          itemsIDsPerCollection[collectionName] = getItems.map(
            (e: any) => e[collection.primary]
          );
        }
      }

      res.json(itemsIDsPerCollection);
    });

    router.get("/files", async (_req: Express.Request, res) => {
      const { accountability, schema } = _req as any as {
        accountability: any;
        schema: schema;
      };

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
        limit: -1,
      });

      const groupedRelations: { [key: string]: string[] } = {};

      for (const { collection, field } of fileRelations) {
        if (groupedRelations[collection] == null)
          groupedRelations[collection] = [];

        groupedRelations[collection]!.push(field);
      }

      for (const collection in groupedRelations) {
        const fields = groupedRelations[collection];
        const service = new services.ItemsService(collection, { schema });

        const getItems = await service.readByQuery({
          fields: fields,
          limit: -1,
        });

        for (const item of getItems) {
          for (const field of fields!) {
            if (item[field] != null) {
              const index = fileIDs.findIndex(
                (e: { id: string }) => e.id == item[field]
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
  },
};

function isRelation(schema: schema, collectionName: string, field: string) {
  return (
    schema.relations.find(
      (rel) => rel.collection == collectionName && rel.field == field
    ) != null
  );
}
