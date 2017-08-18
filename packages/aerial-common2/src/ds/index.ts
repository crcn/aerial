import { weakMemo } from "../memo";
import { difference } from "lodash";

export type DataStore<TRecord> = {
  indexedProperties: {
    [identifier: string]: {
      unique: boolean,
      keyIndexPairs: {
        [identifier: string]: number|number[]
      }
    }
  },
  records: TRecord[]
};

export type DataStoreQuery<T> = Partial<T>;

export type DSUpdateOptions = {
  multi?: boolean;
  upsert?: boolean;
};

export const createDataStore = <TRecord>(records: TRecord[] = []): DataStore<TRecord> => {
  return {
    indexedProperties: {},
    records: [...records]
  };
}

export const createDSQuery = weakMemo((...kvPairs: any[]) => {
  const q = {};
  for (let i = 0; i < kvPairs.length; i += 2) {
    q[kvPairs[i]] = kvPairs[i + 1];
  }
  return q;
});

export const dsIndex = <TRecord>(ds: DataStore<TRecord>, propertyName: string, unique: boolean = true) => {
  if (ds.indexedProperties[propertyName]) {
    throw new Error(`property ${propertyName} is already indexed`);
  }

  ds = {
    ...ds,
    indexedProperties: {
      ...ds.indexedProperties,
      [propertyName]: {
        unique,
        keyIndexPairs: {}
      }
    },
  };

  return dsReindex(ds, propertyName);
}

const getDSFilter = weakMemo(<TRecord extends any>(query: Partial<TRecord>, multi: boolean) => {
  const queryKeys = Object.keys(query) as string[];

  if (queryKeys.length === 1) {
    const queryKey = queryKeys[0];
    const queryValue = query[queryKey];
    return weakMemo((ds: DataStore<TRecord>) => {
      const recordIndicesByProperty = ds.indexedProperties[queryKey];
      const indices = recordIndicesByProperty && recordIndicesByProperty.keyIndexPairs[queryValue as string];

      // oh god, don't look at it.... 
      return indices != null ? multi ? Array.isArray(indices) ? indices.map(i => ds.records[i]) : [ds.records[indices]] : ds.records[Array.isArray(indices) ? indices[0] : indices] : multi ? ds.records.filter(record => record[queryKey] === queryValue) : ds.records.find(record => record[queryKey] === queryValue);
    });
  } else {
    const tester = createQueryTest(query);
    return weakMemo((ds: DataStore<TRecord>) => {
      let hasRest = false;
      let foundIndices: number[];
      let restQuery: any;
      
      for (const key in query) {
        const recordIndicesByProperty = ds.indexedProperties[key];
        const indices = recordIndicesByProperty && recordIndicesByProperty.keyIndexPairs[query[key] as string];
        if (indices != null) {

          if (foundIndices) {
            const mergedIndices = [];
            if (Array.isArray(indices)) {
              for (const index of indices) {
                if (foundIndices.indexOf(index) !== -1) {
                  mergedIndices.push(index);
                }
              }
            } else {
              if (foundIndices.indexOf(indices) !== -1) {
                mergedIndices.push(indices);
              }
            }
            foundIndices = mergedIndices;
          } else {
            foundIndices = Array.isArray(indices) ? indices : [indices];
          }
        } else {
          if (!restQuery) {
            restQuery = {};
          }
          restQuery[key] = query[key];
        }
      }

      const ret = foundIndices != null ? multi ? foundIndices.map((index) => ds.records[index]) : ds.records[foundIndices[0]] : multi ? ds.records.filter(tester) : ds.records.find(tester);
      if (restQuery) {
        return multi ? (ret as TRecord[]).filter(createQueryTest(restQuery)) : createQueryTest(restQuery)(ret) ? ret : null;
      } else {
        return ret;
      }
    });
  }
});

const dsFilterIndexed =  weakMemo(<TRecord extends any>(ds: DataStore<TRecord>, query: Partial<TRecord>, multi: boolean = true) => {
  return getDSFilter(query, multi)(ds);
});

const createQueryTest = <TRecord>(query: DataStoreQuery<TRecord>) => {
  return (record: TRecord) => {
    for (const propertyName in query) {
      if (record[propertyName] !== query[propertyName]) return false;
    }
    return true;
  };
};

export const dsReindex = <TRecord>(ds: DataStore<TRecord>, ...propertyNames: string[]) => {

  if (propertyNames.length === 0) {
    propertyNames = Object.keys(ds.indexedProperties);
  }

  const indexedProperties = {...ds.indexedProperties};

  for (const propertyName of propertyNames) {

    const { unique } = indexedProperties[propertyName];
    const keyIndexPairs = {};
    const newIndex: any = { unique, keyIndexPairs };

    for (let i = 0, n = ds.records.length; i < n; i++) {
      const record        = ds.records[i];
      const propertyValue = record[propertyName];
      const index         = keyIndexPairs[propertyValue];
      if (index != null) {
        if (unique) {
          throw new Error(`Multiple entries found with unique index "${propertyName}".`);
        }
        
        if (typeof index === "number") {
          keyIndexPairs[propertyValue] = [index, i];
        } else {
          keyIndexPairs[propertyValue].push(i);
        }
      } else {
        keyIndexPairs[propertyValue] = i;
      }
    }
    
    indexedProperties[propertyName] = newIndex;
  }

  ds = {
    ...ds,
    indexedProperties,
  };

  return ds;
};

export const dsFind = <TRecord>(ds: DataStore<TRecord>, query: DataStoreQuery<TRecord>) => dsFilterIndexed(ds, query, false) as TRecord;
export const dsFilter = <TRecord>(ds: DataStore<TRecord>, query: DataStoreQuery<TRecord>) => dsFilterIndexed(ds, query, true) as TRecord[];

export const dsSplice = <TRecord>(ds: DataStore<TRecord>, startIndex: number, deleteCount: number, ...newRecords: TRecord[]): DataStore<TRecord> => {
  const records = [
    ...ds.records.slice(0, startIndex),
    ...newRecords,
    ...ds.records.slice(startIndex + deleteCount)
  ];

  return dsReindex({
    ...ds,
    records
  });
};

export const dsInsert = <TRecord>(ds: DataStore<TRecord>, ...newRecords: TRecord[]): DataStore<TRecord> => dsSplice(ds, ds.records.length, 0, ...newRecords);

export const dsRemove = <TRecord extends any>(ds: DataStore<TRecord>, query: Partial<TRecord>, multi: boolean = true) => {
  let indicesToRemove = dsFilter(ds, query).map((record) => ds.records.indexOf(record as TRecord));
  if (!multi && indicesToRemove.length) {
    indicesToRemove = [indicesToRemove[0]];
  }
  const records = [...ds.records];
  for (let i = indicesToRemove.length; i--;) {
    records.splice(indicesToRemove[i], 1);
  }
  return dsReindex({ ...ds, records, });
}

export const dsRemoveOne = <TRecord>(ds: DataStore<TRecord>, query: Partial<TRecord>, multi: boolean = true) => dsRemove(ds, query, false);

export const dsUpdate = <TRecord>(ds: DataStore<TRecord>, query: Partial<TRecord>, properties: Partial<TRecord>, { multi, upsert }: DSUpdateOptions = { multi: true, upsert: false }) => {
  let indicesToUpdate = dsFilter(ds, query).map((record) => ds.records.indexOf(record as TRecord));
  if (indicesToUpdate.length) {
    if (!multi) indicesToUpdate = [indicesToUpdate[0]];
  } else if (upsert) {
    return dsInsert(ds, properties as TRecord);
  }

  const records = [...ds.records];
  for (let i = indicesToUpdate.length; i--;) {
    const index = indicesToUpdate[i];
    records.splice(index, 1, {
      ...(records[index] as any), 
      ...(properties as any) 
    });
  }


  return dsReindex({ ...ds, records, }) as DataStore<TRecord>
}

export const dsUpdateOne = <TRecord extends any>(ds: DataStore<TRecord>, query: Partial<TRecord>, properties: Partial<TRecord>, options: DSUpdateOptions = { upsert: false }) => dsUpdate(ds, query, properties, { ...options, multi: false });
