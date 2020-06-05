/**
 * @module GlobalState
 * @description
 * > Provides Global State Functionality To The App Component
 * @category Helpers
 */
// React
import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * Global State Contexts Store
 * @constant
 */
const GlobalStateContexts = {};

/**
 * Global State's Local States' Setters Store
 * @constant
 */
const GlobalStateSetters = {};

/**
 * Global State Decoupled Flag
 */
let GlobalStateDecoubled = false;

/**
 * @description
 * > Use This Function To Get a Global State Value And a Setter For This Value
 * @param {string} globalStateKey - Global State Key
 * @returns {array} Index 0 of The Array Is The State Value And The Other Index Is The State Setter Function
 */
export function useGlobalState(globalStateKey) {
  const globalStateScope = GlobalStateDecoubled
    ? globalStateKey.slice(0, globalStateKey.indexOf("."))
    : "GlobalStateContext"; // Get Global State Scope
  const globalStateVariable = GlobalStateDecoubled
    ? globalStateKey.slice(globalStateKey.indexOf(".") + 1)
    : globalStateKey; // Get Global State Variable

  // Consume Corresponding Provider
  let globalStateScoppedData, localStateSetter;
  try {
    [globalStateScoppedData, localStateSetter] = React.useContext(
      GlobalStateContexts[globalStateScope]
    );
  } catch (error) {
    throw new Error("undefined global state " + globalStateKey);
  }

  GlobalStateSetters[globalStateKey] =
    GlobalStateSetters[globalStateKey] ||
    ((value) => {
      localStateSetter((prevState) => {
        if (!GlobalStateDecoubled) {
          return {
            ...prevState,
            [globalStateVariable]:
              typeof value === "function"
                ? value(prevState[globalStateVariable])
                : value,
          };
        } else {
          return {
            ...prevState,
            [globalStateScope]: {
              ...prevState[globalStateScope],
              [globalStateVariable]:
                typeof value === "function"
                  ? value(prevState[globalStateScope][globalStateVariable])
                  : value,
            },
          };
        }
      });
    });
  return globalStateScoppedData
    ? [
        globalStateScoppedData[globalStateVariable],
        GlobalStateSetters[globalStateKey],
      ]
    : [undefined, () => {}];
}

/**
 * Global State Context Providers' Values
 */
const ProvidersValues = {};

/**
 * @name GlobalStateProvider
 * @component
 * @description
 * > Returns The Global State Provider Component To Be Used For Wrapping The App
 * @category Helpers
 */
const GlobalState = (props) => {
  GlobalStateDecoubled = props.decoupled ? true : false;

  // Construct Global State Object
  let InitialGlobalState = { ...props.state };

  // Create a Store For The Global State
  const [state, localStateSetter] = useState(InitialGlobalState);

  // Create Contexts
  if (!Object.keys(GlobalStateContexts).length) {
    if (GlobalStateDecoubled) {
      for (let i in props.state) {
        GlobalStateContexts[i] = React.createContext({});
        GlobalStateContexts[i].displayName = "GlobalStateContext-" + i;
      }
    } else {
      GlobalStateContexts["GlobalStateContext"] = React.createContext({});
      GlobalStateContexts["GlobalStateContext"].displayName =
        "GlobalStateContext";
    }
  }

  // Create Providers Tree
  const providers = Object.keys(GlobalStateContexts)
    .reverse()
    .reduce(
      (acc, key) =>
        React.createElement(
          GlobalStateContexts[key].Provider,
          {
            value:
              ProvidersValues[key] && ProvidersValues[key][0] === state[key]
                ? ProvidersValues[key]
                : (() => {
                    ProvidersValues[key] = [
                      GlobalStateDecoubled ? state[key] : state,
                      localStateSetter,
                    ];
                    return ProvidersValues[key];
                  })(),
          },
          acc
        ),
      props.children
    );

  // Render Providers
  return <React.Fragment>{providers || null}</React.Fragment>;
};

GlobalState.propTypes = {
  /**
   * Initial Global State
   */
  state: PropTypes.object.isRequired,
  /**
   * Whether State is decoupled or not
   */
  decoupled: PropTypes.bool,
  /**
   * Children usually are the app components
   */
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

GlobalState.defaultProps = {
  decoupled: false,
  state: {},
  children: <React.Fragment></React.Fragment>,
};

export default GlobalState;
