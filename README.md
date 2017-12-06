# React-MQL-Manager
[![npm version](https://badge.fury.io/js/react-mql-manager.svg)](https://badge.fury.io/js/react-mql-manager)

React-MQL-Manager is an unopinionated, flexible set of modules allowing you to handle media queries in React (or JS generally) regardless of your approach to state management. It internally constructs [Media Query Lists](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList) and provides an API allowing you to react to changes.

If you are **not using a state-management library**, `React-MQL-Manager` exports a `<Provider>` component to pass your queries down your component tree, as well as a higher-order component: `withMediaQueries`, or alternatively, a `<MediaQueriesRenderProps>` component to wrap any child component that needs to access the queries match state. [See further here](https://github.com/AWebOfBrown/React-MQL-Manager/blob/master/documentation/withoutStateManagementLibs.md)

If you **are using a state-management library**, you will interact with the core class of the library, the MQL-Manager class. This class (not a React component) internally constructs your Media Query Lists based on a simple `queries` argument you provide, like so:

```javascript
// ES Modules
import {MQLManager} from "react-mql-manager"

const myQueryManager = new MQLManager({
    queries: {
        S: "(max-width: 480px)", 
        M: "(min-width: 481px) and (max-width: 1079px)",
        L: "(min-width: 1080px)"
    },
    onChange: ({S, M, L}) => doSomethingOnChange(S,M,L),
    debounce: 1000
})
```
The `onChange` argument you provide fires every time one of your queries' match state changes, but can be debounced using the optional `debounce` argument (type: Num of microseconds). [See further here](https://github.com/AWebOfBrown/React-MQL-Manager/blob/master/documentation/withStateManagementLibs.md)

React-MQL-Manager can be consumed as CommonJS modules, ES modules or UMD.

## Install
`yarn add react-mql-manager` 

or

`npm i react-mql-manager`

## Demo
See a codesandbox.io demo of React-MQL-Manager with no state management lib, Redux, and Mobx, and React-Broadcast [here](https://codesandbox.io/s/p93xmm0zmm)

## Troubleshooting
[See here](https://github.com/AWebOfBrown/React-MQL-Manager/blob/master/documentation/troubleshooting.md)