import React, {Component, createElement, createContext} from "react";
import {assignAll} from '@iosio/utils/lib/assignAll';
import {mapIt} from "./utils";

const StoreContext = createContext();
export const Provider = ({store, actions, collective, children}) =>
    <StoreContext.Provider value={{store, actions, collective}}>{children} </StoreContext.Provider>;

const getDisplayName = (WrappedComponent) => WrappedComponent.displayName || WrappedComponent.name || 'Component';

export const connect = ({mapState, mapActions, mapLogic, additionalProps}) => Child => {
    function Wrapper(props, context) {
        Component.call(this, props, context);
        const {store, actions, collective} = context;
        let mappedProps = {},
            state = {},
            update = () => {
            }, sub, unsub;

        if (actions && mapActions) {
            mappedProps = mapIt(mapActions, actions.getActions());
        }
        if (collective && mapLogic) {
            mappedProps = assignAll(mappedProps, [mapIt(mapLogic, collective.getCollective())])
        }
        if (store && mapState) {
            state = mapIt(mapState, store.getState());
            update = () => {
                if (this.mounted) {
                    let mapped = mapIt(mapState, store.getState());
                    for (let i in mapped) {
                        if (mapped[i] !== state[i]) {
                            state = mapped;
                            this.mounted && this.forceUpdate();
                            return;
                        }
                    }
                    for (let i in state) {
                        if (!(i in mapped)) {
                            state = mapped;
                            this.mounted && this.forceUpdate();
                            return
                        }
                    }
                }
            };
            sub = () => store.subscribe(update);
            unsub = () => store.unsubscribe(update);
        }

        this.componentDidMount = () => {
            this.mounted = true;
            sub && sub();
        };
        this.componentWillUnmount = () => {
            this.mounted = false;
            unsub && unsub();
        };
        this.render = () =>
            createElement(Child, assignAll({}, [mappedProps, this.props, state, additionalProps]));
    }

    const TheComponent = (Wrapper.prototype = new Component()).constructor = Wrapper;
    TheComponent.displayName = `${getDisplayName(Child)}_connected`;
    TheComponent.contextType = StoreContext;
    return TheComponent;
};