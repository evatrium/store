import {createActions, createStore} from "../src";

describe('createActions', () => {

    it('should create actions for the given state object', () => {

        const store = createStore();

        let actions = {};

        let initialState = {count: 0, loggedIn: false};

        let actionsName = 'myNamespace';

        store.attachState({[actionsName]: initialState});

        actions = createActions(actionsName, initialState, store, actions);

        expect(actions).toMatchObject({
            myNamespace: {
                set: {
                    count: expect.any(Function),
                    loggedIn: expect.any(Function)
                },
                get: {
                    count: expect.any(Function),
                    loggedIn: expect.any(Function)
                },
                toggle: {
                    count: expect.any(Function),
                    loggedIn: expect.any(Function)
                },
                update: expect.any(Function),
                merge: expect.any(Function),
                getState: expect.any(Function)
            }
        });

    })

});


describe('createActions state manipulation', () => {

    const store = createStore();

    let actions = {};

    let initialState = {count: 0, loggedIn: false};

    let actionsName = 'namespace';

    store.attachState({[actionsName]: initialState});

    createActions(actionsName, initialState, store, actions);


    it('action namespace should have getState() which only returns that namespace', () => {

        expect(actions[actionsName].getState()).toMatchObject(initialState);

    });

    it('should .get() and return the value', () => {

        expect(actions[actionsName].get.count()).toBe(0);
        expect(actions[actionsName].get.loggedIn()).toBe(false);
    });

    it('should .merge() properties to the state', () => {

        actions[actionsName].merge({count: 1, loggedIn: true});

        expect(actions[actionsName].get.count()).toBe(1);
        expect(actions[actionsName].get.loggedIn()).toBe(true);
        expect(actions[actionsName].merge({count: 0, loggedIn: false}));

    });

    it('should .update() the state', () => {
        actions[actionsName].update(state => ({
            ...state,
            count: 1,
            loggedIn: true
        }));

        expect(actions[actionsName].get.count()).toBe(1);
        expect(actions[actionsName].get.loggedIn()).toBe(true);
        expect(actions[actionsName].merge({count: 0, loggedIn: false}));
    });

    it('should .toggle() the state', () => {
        actions[actionsName].toggle.loggedIn();

        expect(actions[actionsName].get.loggedIn()).toBe(true);
        actions[actionsName].toggle.loggedIn();
        expect(actions[actionsName].get.loggedIn()).toBe(false);
    });


    it('should .set() the state without side effects - ensure no mutations on the namespace: actions[actionsName].getState()', () => {

        const store = createStore();

        let actions = {};

        let initialState = {count: 0, loggedIn: false};

        let actionsName = 'namespace';

        store.attachState({[actionsName]: initialState});

        createActions(actionsName, initialState, store, actions);

        //try and mutate it
        const changeIt = actions[actionsName].getState();

        //mutate this
        changeIt.count = 4;


        expect(actions[actionsName].getState()).toMatchObject({count: 0, loggedIn: false});

        actions[actionsName].set.count(1);

        expect(store.getState()).toMatchObject({[actionsName]: {count: 1, loggedIn: false}});

        actions[actionsName].set.loggedIn(true);

        expect(store.getState()).toMatchObject({[actionsName]: {count: 1, loggedIn: true}});

    });


});