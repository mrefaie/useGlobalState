<h1 align="center">react-useglobalstate</h1>

![npm](https://img.shields.io/npm/v/@morefaie/react-useglobalstate)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@morefaie/react-useglobalstate)
![npm](https://img.shields.io/npm/dm/@morefaie/react-useglobalstate)
![NPM](https://img.shields.io/npm/l/@morefaie/react-useglobalstate)

## Introduction

Many developers are looking for a solution to handle a react app global state away from `Redux`. So, I have created this package to simplify global state management for small and medium sized apps

## Basic usage

```sh
npm i @morefaie/react-useglobalstate
# or
yarn add @morefaie/react-useglobalstate
```

#### Initializing State

In your App.js file (or the top file of components that will use the global state) import the global state provider, initialize the global state and wrap your app components with the provider.

```js
import GlobalStateProvider from "@morefaie/react-useglobalstate";

// ...

const initialGlobalState = {
  isUserLoggedIn: false,
};

const App = () => {
  // ...

  return (
    <GlobalStateProvider state={initialGlobalState}>
      {/* You app entry components here */}
    </GlobalStateProvider>
  );
};

export default App;
```

To access the global state from any component:

```js
import { useGlobalState } from "@morefaie/react-useglobalstate";

// ...

const SampleComponent = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useGlobalState("isUserLoggedIn");

  // ...
};
```

## Decoupled States

The previously mention usage will work fine but has a performance impact if you have many global states that are not related. Updating any state key will cause all the components that uses useGlobalState to re-render.

If you want to define decoupled state just pass the `decoupled` prop to the state provider and define your initial state as follows:

```js
import GlobalStateProvider from "@morefaie/react-useglobalstate";

// ...

const initialGlobalState = {
  user: {
    isLoggedIn: false,
  },
  global: {
    language: "en",
  },
};

const App = () => {
  // ...

  return (
    <GlobalStateProvider state={initialGlobalState} decoupled>
      {/* You app entry components here */}
    </GlobalStateProvider>
  );
};

export default App;
```

To access the global state from any component:

```js
import { useGlobalState } from "@morefaie/react-useglobalstate";

// ...

const SampleComponent = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useGlobalState("user.isLoggedIn");

  // ...
};

const AnotherSampleComponent = () => {
  const [appLang, setAppLang] = useGlobalState("global.language");

  // ...
};

const YetAnotherSampleComponent = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useGlobalState("user.isLoggedIn");
  const [appLang, setAppLang] = useGlobalState("global.language");

  // ...
};
```

Consider that the components in the example above are rendered in the same page. Mutating the `isLoggedIn` state will cause only `SampleComponent` and `YetAnotherSampleComponent` to re-render.

## Examples

[Normal Global State](https://codesandbox.io/s/useglobalstate-basic-usage-xnmo3)

[Decoupled Global State](https://codesandbox.io/s/useglobalstate-decoupled-ps2u4)

---

With ❤️ from Mohamed El-Refaie
