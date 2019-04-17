import {assign} from "@iosio/utils/lib/assign";

/**
 * creates a store to store state, get and set state, attach new state properties and subscribe to updates
 * @param {undefined|Object} state - the state object to hold all the namespaced state
 * @returns {{attachState: attachState, getState: (function(): *), unsubscribe: unsubscribe, subscribe: (function(*=): function(): void), setState: setState}}
 */
export const createStore = (state) => {
    /**
     * holds all teh subscription callback functions
     * @type {Array}
     */
    let listeners = [];

    /**
     * state object
     * @type {Object|{}} - holds state
     */
    state = state || {};


    /**
     * removes the listener
     * @param {function} listener - named callback function to be removed from listeners when unsubscribed
     * @returns {undefined} - returns nothing
     */
    const unsubscribe = (listener) => {
        let out = [];
        for (let i = 0; i < listeners.length; i++) {
            if (listeners[i] === listener) {
                listener = null;
            } else {
                out.push(listeners[i]);
            }
        }
        listeners = out;
    };

    return {
        unsubscribe,
        /**
         * gets the entire state object
         * @returns {Object} - the state object
         */
        getState: () => state,
        /**
         * merges new state to the existing state object unless overwrite is true, thus replaces the state.
         * triggers a state update, calling all listeners, passing the updated state to the callbacks
         * @param {Object} update - to be merged to state
         * @param {boolean} overwrite - replaces the existing state with the update if true
         * @returns {undefined} - returns nothing
         */
        setState: (update, overwrite) => {
            state = overwrite ? update : assign(assign({}, state), update);
            let current = listeners;
            for (let i = 0; i < current.length; i++) current[i](state);
        },
        /**
         * pass a callback function to subscribe to state updates
         * @param {function} listener - callback function
         * @returns {function(): *} - call this function to unsubscribe this specific listener
         */
        subscribe: (listener) => {
            listeners.push(listener);
            return () => unsubscribe(listener);
        },
        /**
         * attaches new state to the state object without triggering an update
         * @param {object} new_state - stage object to be merged to existing state
         * @returns {undefined} - returns nothing
         */
        attachState: (new_state) => {
            state = assign(assign({}, state), new_state);
        },
    }
};



