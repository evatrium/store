// import React, {Component, Children, createElement} from "react";
// import {assignAll} from '@iosio/utils/lib/assignAll';
// import {mapIt} from "./utils";
//
// const getDisplayName = (WrappedComponent) => WrappedComponent.displayName || WrappedComponent.name || 'Component';
//
// export const CONTEXT_TYPES = {
//     store: () => {
//     },
//     actions: () => {
//     },
//     collective: () => {
//     }
// };
//
//
//
// export class Provider extends Component {
//     getChildContext() {
//         return {store: this.props.store, actions: this.props.actions, collective: this.props.collective};
//     }
//
//     render() {
//         return Children.only(this.props.children);
//     }
// }
//
// Provider.childContextTypes = CONTEXT_TYPES;
//
// export const connect = ({mapState, mapActions, mapLogic, additionalProps}) => {
//     return Child => {
//         function Wrapper(props, context) {
//             Component.call(this, props, context);
//             const store = context.store;
//             const actions = context.actions;
//             const collective = context.collective;
//
//             let mappedProps = {},
//                 state = {},
//                 update = () => {
//                 },
//                 sub,
//                 unsub;
//
//             if (actions && mapActions) {
//                 mappedProps = mapIt(mapActions, actions.getActions());
//             }
//             if (collective && mapLogic) {
//                 mappedProps = assignAll(mappedProps, [mapIt(mapLogic, collective.getCollective())])
//             }
//             if (store && mapState) {
//                 state = mapIt(mapState, store.getState());
//
//                 update = () => {
//                     if (this.mounted) {
//                         let mapped = mapIt(mapState, store.getState());
//                         for (let i in mapped) {
//                             if (mapped[i] !== state[i]) {
//                                 state = mapped;
//                                 this.mounted && this.forceUpdate();
//                                 return;
//                             }
//                         }
//                         for (let i in state) {
//                             if (!(i in mapped)) {
//                                 state = mapped;
//                                 this.mounted && this.forceUpdate();
//                                 return
//                             }
//                         }
//                     }
//                 };
//                 sub = () => store.subscribe(update);
//                 unsub = () => store.unsubscribe(update);
//             }
//
//             this.componentDidMount = () => {
//                 this.mounted = true;
//                 sub && sub();
//             };
//
//             this.componentWillUnmount = () => {
//                 this.mounted = false;
//                 unsub && unsub();
//             };
//
//
//             this.render = () =>
//                 createElement(Child, assignAll({}, [mappedProps, this.props, state, additionalProps]));
//         }
//
//         const TheComponent = (Wrapper.prototype = new Component()).constructor = Wrapper;
//
//
//         TheComponent.displayName = `${getDisplayName(Child)}_connected`;
//         TheComponent.contextTypes = CONTEXT_TYPES;
//
//         return TheComponent;
//     }
// };
