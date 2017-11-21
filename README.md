# React-MQL-Manager
React-MQL-Manager is an unopinionated, flexible set of modules allowing you to handle media queries in React (or JS generally) regardless of your approach to state management. It internally constructs [Media Query Lists](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList) and provides an API allowing you to react to changes.

React-MQL-Manager can be consumed as CommonJS modules, ES modules or UMD.

## Install
`yarn add react-mql-manager` 

or

`npm i -P react-mql-manager`

## Demo
See a codesandbox.io demo of React-MQL-Manager with no state management lib, Redux, and Mobx, [here](https://codesandbox.io/s/p93xmm0zmm)

## Documentation / How To: 
### Use with React and No State Management Library / API
See [documentation](https://github.com/AWebOfBrown/React-MQL-Manager/blob/master/documentation/vanillaReact.md)
### Use with React and State Management Libraries (e.g. Redux & MobX) / API
see [documentation](https://github.com/AWebOfBrown/React-MQL-Manager/blob/master/documentation/mobXAndRedux.md)

## Generic Implementation Details
At the libraries' core is the MQL-Manager class (not a React component) that internally constructs your Media Query Lists based on a simple `queries` argument you provide, like so:

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
The `onChange` argument you provide fires every time one of your queries' match state changes, but can be debounced using the optional `debounce` argument (type: Num of microseconds).

Obviously we need somewhere to keep our match state and send it to components that want to know about it. React-MQL-Manager can integrate with any typical approach to state management in React: using no state management library, Redux, and MobX.  

## Integrating with React & No State Management Library:
React-MQL-Manager exports a Provider component which uses the context API to broadcast match state changes to
any component in your React component tree. It uses the MQLManager module internally, and all you need to do is pass the `Provider` a `queries` prop, optionally provide a `debounce` prop, and wrap your custom components (which need the media query state) with either React-MQL-Manager's `withMediaQueries` Higher-Order-Component, or use the `MediaQueriesRenderProps` component. Please see the documentation for further details, and the codesandbox demo for a simple implementation.

## Redux / MobX
The most common use-case would be to wrap a custom React (class) component, ideally one that does not
unmount, with `react-redux`'s `connect()` or `mobx-react`'s `inject()`. You would then import and set an MQLManager as your component's class property, and lastly specify, respectively, a mapDispatchToProps function, or a setter action injected from a MobX store, to MQLManager's onChange argument. For more, see the documentation and the codesandbox demo, linked above, for simple integrations with both libraries.
