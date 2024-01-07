import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { FirebaseError } from 'firebase/app';
import { AuthError } from './auth-provider';


function getResults(queryDocs) {
  return queryDocs.docs.map(d => ({id: d.id, ...d.data()}));
}

function packageResults(docs) {
  return { data: docs, total: docs.length };
}

function mapError(error) {
  if (error instanceof FirebaseError && error.code == 'permission-denied') {
    throw new AuthError(error);
  }
}

export const dataProvider = ({ firestore, firestoreFuncs: ff }) => ({
  // get a list of records based on sort, filter, and pagination
  getList: async (resource, params) => {
    let c = ff.collection(firestore, resource)
    return ff.getDocs(ff.query(c))
      .then(getResults)
      .then(packageResults)
      .catch(mapError)
  },
  // get a single record by id
  getOne:     (resource, params) => Promise.resolve(),
  // get a list of records based on an array of ids
  getMany:    (resource, params) => {
    console.log({resource, params});
    const { ids, meta } = params;
    const { targetField = 'id' } = meta;
    return ff.getDocs(ff.query(ff.collection(firestore, resource), ff.where(targetField, "in", ids)))
    .then(getResults)
    .then(results => results.map(r => ({...r, id: r[targetField]})))
    .then(packageResults)
    .catch(mapError)
  },
  // get the records referenced to another record, e.g. comments for a post
  getManyReference: (resource, params) => Promise.resolve(),
  // create a record
  create:     (resource, params) => Promise.resolve(),
  // update a record based on a patch
  update:     (resource, params) => Promise.resolve(),
  // update a list of records based on an array of ids and a common patch
  updateMany: (resource, params) => Promise.resolve(),
  // delete a record by id
  delete:     (resource, params) => Promise.resolve(),
  // delete a list of records based on an array of ids
  deleteMany: (resource, params) => Promise.resolve(),
})
