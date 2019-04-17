// import React, {createContext, useContext, useEffect, useState} from "react";
// import {assignAll} from '@iosio/utils/lib/assignAll';
// import {mapIt} from "./utils";
//
// const StoreContext = createContext();
// export const Provider = ({store, actions, collective, children}) => {
//     return <StoreContext.Provider value={{store, actions, collective}}>{children} </StoreContext.Provider>
// };
//
//
// const useStore = ({mapState, mapActions, mapLogic, additionalProps}, props, forceUpdate) => {
//
//     const {store, actions, collective} = useContext(StoreContext);
//
//     useEffect(() => {
//         let mappedProps = {},
//             state = {},
//             __update__ = () => {
//             }, sub, unsub, mounted = true;
//
//         if (actions && mapActions) {
//             mappedProps = mapIt(mapActions, actions.getActions());
//         }
//
//         if (collective && mapLogic) {
//             mappedProps = assignAll(mappedProps, [mapIt(mapLogic, collective.getCollective())])
//         }
//
//         if (store && mapState) {
//             state = mapIt(mapState, store.getState());
//
//             __update__ = () => {
//                 if (mounted) {
//
//                     let mapped = mapIt(mapState, store.getState());
//
//                     for (let i in mapped) {
//                         if (mapped[i] !== state[i]) {
//                             state = mapped;
//                             mounted && forceUpdate(combined());
//                             return;
//                         }
//                     }
//                     for (let i in state) {
//                         if (!(i in mapped)) {
//                             state = mapped;
//                             mounted && forceUpdate(combined());
//                             return
//                         }
//                     }
//                 }
//             };
//             sub = () => store.subscribe(__update__);
//             unsub = () => store.unsubscribe(__update__)
//         }
//
//         const combined = () => assignAll({}, [mappedProps, state, additionalProps, props]);
//
//         forceUpdate(combined());
//
//         sub && sub();
//
//         return () => {
//             mounted = false;
//             unsub && unsub();
//         }
//     }, []);
// };
//
// export const connect = (config) => (Child) => (props) => {
//     const [state, setState] = useState();
//     useStore(config, props, setState);
//     return <Child {...state}/>
// };
