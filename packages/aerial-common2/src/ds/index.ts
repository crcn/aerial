export type DataStore<TValue> = {
  indexed: {
    [identifier: string]: {
      unique: boolean,
      indices: {
        [identifier: string]: number[]
      }
    }
  },
  values: TValue[]
};

export type DataStoreQuery<T> = any;

export const createDataStore = <TValue>(values: TValue[] = []): DataStore<TValue> => {
  return {
    indexed: {},
    values: [...values]
  };
}

export const dsIndex = <TValue>(ds: DataStore<TValue>, propertyName: string, unique: boolean = false) => {
  if (ds.indexed[propertyName]) {
    throw new Error(`property ${propertyName} is already indexed`);
  }
  ds = {
    ...ds,
    indexed: {
      ...ds.indexed,
      [propertyName]: { unique, indices: [] }
    },
  };

  return dsReindex(ds, propertyName);
}

const dsFilterIndexed = <TValue>(ds: DataStore<TValue>, query: DataStoreQuery<TValue>) => {
  let indices: number[] = [];
  for (const propertyName in query) {
    const index = ds.indexed[propertyName];
    const value = query[propertyName];
    if (index) {
      const values = index.indices[value];
      if (typeof values === "number") {
        indices.push(values);
      } else {
        indices.push(...values);
      }
    }
  }

  return indices.length ? indices.length === 1 ? [ds.values[indices[0]]] : indices.map((i) => ds.values[i]) : ds.values;
};

const createQueryTest = <TValue>(query: DataStoreQuery<TValue>) => {
  return (value: TValue) => {
    for (const propertyName in query) {
      if (value[propertyName] !== query[propertyName]) return false;
    }
    return true;
  };
};

export const dsReindex = <TValue>(ds: DataStore<TValue>, propertyName: string) => {

  const newIndicies = {};

for (let i = 0, n = ds.values.length; i < n; i++) {
  const value = ds.values[i];
  let v;
  if (!(v = newIndicies[value[propertyName]])) {
    v = newIndicies[value[propertyName]] = [];
  }
  v.push(i);
}

  ds = {
    ...ds,
    indexed: {
      ...ds.indexed,
      [propertyName]: {
        unique: ds.indexed[propertyName].unique,
        indices: newIndicies
      }
    }
  };

  return ds;
};

export const dsFind = <TValue>(ds: DataStore<TValue>, query: DataStoreQuery<TValue>) => {
  return dsFilterIndexed(ds, query).find(createQueryTest(query));
};

export const dsFilter = <TValue>(ds: DataStore<TValue>, query: DataStoreQuery<TValue>) => {
  return dsFilterIndexed(ds, query).filter(createQueryTest(query));
};