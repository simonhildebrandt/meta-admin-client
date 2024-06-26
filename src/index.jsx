import React, { createElement, useState, useEffect } from 'react';
import {
  AdminContext,
  AdminUI,
  defaultI18nProvider,
  Resource,
  ListGuesser,
  localStorageStore,
  useLogout,
} from 'react-admin';

import * as ReactAdminComponents from "react-admin";

import { dataProvider } from './data-provider';
import { authProvider, ApiContext, useLoginState } from './auth-provider';
import LoginPage from './login-page';

//import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";



function hydrate(config) {
  if (!config) return;

  const { type, props: { children = [], ...others } } = config;
  let element = type;

  const firstLetter = type[0];
  if (firstLetter.toUpperCase() === firstLetter) {
    element = ReactAdminComponents[type];
  }

  return createElement(element, others, ...children.map(hydrate));
}


function AsyncResources({config}) {
  const [collections, setCollections] = useState([]);

  const logout = useLogout();

  const { token, api } = useLoginState();

  useEffect(_ => {
    api.get("collections")
    .then(({data}) => {
      setCollections(data.collections)
    })
    .catch(logout)
  }, [token]);

  return <AdminUI loginPage={LoginPage}>
    { collections.map(collection => (
      <Resource key={collection} name={collection} list={hydrate(config[collection]) || ListGuesser} />
    ))}
    </AdminUI>
}


const store = localStorageStore();

export default function Admin({config, firestore, firebaseAuth, apiURL, basename="/admin"}) {
  console.log({basename})
  return <ApiContext.Provider value={apiURL}>
    <AdminContext
      dataProvider={dataProvider({firestore})}
      authProvider={authProvider({firebaseAuth, apiURL})}
      i18nProvider={defaultI18nProvider}
      store={store}
      basename={basename}
    >
      <AsyncResources config={config}/>
    </AdminContext>
  </ApiContext.Provider>
}

