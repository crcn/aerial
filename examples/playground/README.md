very simple online playground for visually creating web applications

Immediate TODOS:

- [ ] Synthetic Browser worker
- [ ] Map synthetic browser state to application state
- [ ] layout data like DB



State mapping:

```typescript
const browser = new SyntheticBrowser();

const observeTree = (node) => {
  // ...
};

type Collection<T> = {
  indexes: {
    [identifier: string]: {
      [identifier: string|number]: number
    }
  },
  items: T[]
}

type TreeNodeEntry = {
  parentId?: number,
  id: number,
  name: string,
}

const collection: Collection<TreeNodeEntry> = {
  indexes: {
    id: { 1: 0, 2: 1, 3: 2, 4: 3 }
  },
  items: [{ id: 1 }, { id: 2, parentId: 1 }, { id: 3, parentId: 1 }, { id: 4, parentId: 3 }]
};

const dsFind = (collection: Collection<T>, query: Partial<T>) => {
  let matches = collection.items;
  for (const key in query) {
    const value = query[key];
    if (collection.indexes[key][value]) {
      matches[collection.indexes[key]];
    }
  }
};

const dsFindOne = (collection: Collection<T>, query: Partial<T>) => {
  return dsFind(collection, query)[0];
};

const dsIndex = (collection, propertyName) => {
  const indexes = {};
  for (const item of collection.items) {
    const 
  }
}

const dsInsert = (collection: Collection<T>, ...items: T[]) => {
  
}

type TreeNode = {
  parent: TreeNode,
  childNodes: TreeNode,
}

const mapTreeNode = (collection, parent) => {
  const self = {
    parent: parent,
  };

  self.childNodes = dsFind(collection, { parentId: parent.id }).mapTreeNode(collection, self);
  return self;
}

```