import {assign} from "@iosio/utils/lib/assign";


/**
 * Helper function for creating simple to use state control actions on the specified namespace of the store's state object.
 * @param {string} actionsName - a string to be assigned as the namespace in which to access the actions on
 * @param {Object} initialState - the state object whose property names will be used to create actions with
 * @param {Object} store - store object containing methods created by "createStore()"
 * @param {Object} actions - the global namespaced actions object
 * @returns {*} actions - the global namespaced actions object applied with the new namespace actions
 */
export const createActions = (actionsName, initialState, store, actions) => {

    /**
     * define the new namespace on the global actions object to hold the actions to be assigned
     * @type {{set: {}, get: {}, merge: merge, update: update, toggle: {}}}
     */
    actions[actionsName] = {
        set: {},
        get: {},
        toggle: {},
        update: () => {
        },
        merge: () => {
        }
    };

    /**
     * for updating multiple state properties at a time
     * must assign/spread the existing state that is passed to the callback function if updating only a few properties.
     * otherwise, the properties that are not returned that do exist on the previous state will be missing on the next state update
     *
     * @example
     *  myNameSpacedActions.update(state=>({
     *      ...state,//all the other existing properties
     *      someExistingProp: 'some new value'
     *  }));
     *
     * @param {function} cb - a callback function providing the previous state as an argument
     * @returns {undefined} - returns nothing
     */
    actions[actionsName].update = (cb) => {

        let state = store.getState();
        //just to be sure not to modify the original reference, make a copy
        let copyOfExistingState = assign({}, state);
        //get the object on the namespace which to make the modifications on
        let oldNameSpaceState = state[actionsName];
        //provide the state to the callback and retrieve the results
        let updatedNameSpaceState = cb(oldNameSpaceState);
        //take the results and apply them on a namespace property of a new object
        let toBeMerged = assign({}, {[actionsName]: updatedNameSpaceState});
        //merge the update to the state copy
        let allState = assign(copyOfExistingState, toBeMerged);
        //set the state on the store
        store.setState(allState);

    };

    /**
     * merges new properties on the state namespace
     * but without the need to re-spread the previous state on the return object
     * @example
     *  myNameSpacedActions.merge({
     *          someExistingProp: 'some new value',
     *          anotherExistingProp: 'another new value'
     *      });
     *
     * @param {Object} propsToMergeToNameSpace - new object containing properties to merge onto the namespaced state
     * @returns {undefined} - returns nothing
     */
    actions[actionsName].merge = (propsToMergeToNameSpace) => {

        let state = store.getState();

        let copyOfExistingState = assign({}, state);

        let oldNameSpaceState = state[actionsName];

        let updatedNameSpaceState = assign(oldNameSpaceState, propsToMergeToNameSpace);

        let toBeMerged = {[actionsName]: updatedNameSpaceState};

        let allState = assign(copyOfExistingState, toBeMerged);

        store.setState(allState);
    };

    /**
     * gets the state object that belongs only to the namespace
     * @returns {Object} - namespace state
     */
    actions[actionsName].getState = () => {
        const namespaceState = store.getState()[actionsName];
        return assign({}, namespaceState);
    }


    /*
        for every property on the initialState object
        create a set, get, and toggle function
     */

    for (let key in initialState) {

        /**
         * sets a single property value on the state
         * @param {*} newValue - value to set
         * @returns {undefined} - returns nothing
         */
        actions[actionsName].set[key] = (newValue) => {

            let state = store.getState();

            let copyOfExistingState = assign({}, state);

            let oldNameSpaceState = state[actionsName];

            let propsToMergeToNameSpace = {[key]: newValue};

            let updatedNameSpaceState = assign(oldNameSpaceState, propsToMergeToNameSpace);

            let toBeMerged = {[actionsName]: updatedNameSpaceState};

            let allState = assign(copyOfExistingState, toBeMerged);

            store.setState(allState);
        };

        /**
         * gets a specific property value on the state
         * @returns {*}
         */
        actions[actionsName].get[key] = () => {

            let nameSpaceKeyValue = store.getState()[actionsName][key];

            let tobBeCopied = {[key]: nameSpaceKeyValue};

            let copied = assign({}, tobBeCopied);

            return copied[key];
        };

        /**
         * gets the previous value and updates it with the inverse
         */
        actions[actionsName].toggle[key] = () => {
            actions[actionsName].set[key](!actions[actionsName].get[key]())
        };
    }
    return actions;
};