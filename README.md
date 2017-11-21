# React-MQL-Manager
React-MQL-Manager is an unopinionated, flexible set of modules allowing you to handle media queries in React (or JS generally) regardless of your approach to state management.

## Install
`yarn add react-mql-manager` 
or
`npm i -s react-mql-manager`

## Use
React-MQL-Manager can be consumed as CommonJS modules, ES Modules or UMD.

At its core is the MQL-Manager class (not a React component) that internally constructs your Media Query Lists based on a simple `queries` argument you provide, like so:

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
Obviously we need somewhere to keep our match state and send it to components that want to know about it. React-MQL-Manager can integrate with any typical approach to state management in React: using no state management library, Redux, and MobX.  

## Demo
See a codesandbox.io demo of React-MQL-Manager with no state management lib, Redux, and Mobx, here.

## No state management library:
React-MQL-Manager exports a Provider component which uses the context API to broadcast match state changes to
any component in your React component tree, provided you wrap your component with either React-MQL-Manager's `withMediaQueries` Higher-Order-Component, or use the `MediaQueriesRenderProps` component. As demonstrated in the codesandbox demo, all you need to do is use the `<Provider>` component at the top of your React tree, and then use either the HOC or render props component to provide your component with access to the match state.    

## Redux / MobX
The most common use-case would be to wrap a component, ideally one that does not
unmount, with `react-redux`'s `connect()` or `mobx-react`'s `inject`. You would then import and set an MQLManager as your component's class property, and then specify, respectively, a mapDispatchToProps function, or a setter action injected from a MobX store, to MQLManager's onChange argument. See the codesandbox.io for simple integrations with both libraries.
