import {createStore, createActions, connect, Provider} from "../src";
import React from 'react';
import renderer from 'react-test-renderer';

const namespace = 'namespace';


const SetUp = () => {
    const store = createStore();

    let actions = {};
    const getActions = () => actions;
    let collective = {
        [namespace]:{
            testFunc: () => {
                return "hello"
            }
        }

    };
    const getCollective = () => collective;

    const initialState = {count: 0, name: 'Tom'};

    store.attachState({[namespace]: initialState});

    createActions(namespace, initialState, store, actions);

    const Prov = ({children}) => (
        <Provider store={store} actions={{getActions}} collective={{getCollective}}>{children}</Provider>
    );


    return {
        Prov,
        ...actions[namespace]
    }
};

describe('Provider provides state updates to connect', () => {


    it('renders without crashing', () => {

        const {Prov} = SetUp();

        const tree = renderer.create(
            <Prov>
                <div>test</div>
            </Prov>
        );

        expect(tree).toMatchSnapshot();
    });

    it('passes the right props to the component', () => {

        const {Prov} = SetUp();

        const MyLabel = connect({mapState: {[namespace]: 'name'}})((props) => {
            expect(props.name).toBe('Tom');
            return <div>{props.name}</div>
        });


        const tree = renderer.create(
            <Prov>
                <MyLabel/>
            </Prov>
        );

        expect(tree).toMatchSnapshot();

    });

    it('updates to state are reflected on the component', () => {

        const {Prov, set} = SetUp();

        set.name('Alpha')

        const MyLabel2 = connect({mapState: {[namespace]: 'name'}})((props) => {
            expect(props.name).toBe('Alpha');
            return <div>{props.name}</div>
        });


       let tree = renderer.create(
            <Prov>
                <MyLabel2/>
            </Prov>
        );

        expect(tree).toMatchSnapshot();

    });



    it('maps actions to props', () => {

        const {Prov} = SetUp();


        const MyLabel = connect({mapActions: {[namespace]: 'set,get'}})((props) => {

            expect(props).toMatchObject({
                set: {
                    count: expect.any(Function),
                    name:expect.any(Function)
                },
                get:{
                    count: expect.any(Function),
                    name:expect.any(Function)
                },
            });

            return <div>mapped actions: {JSON.stringify(props, null, 4)}</div>
        });


        let tree = renderer.create(
            <Prov>
                <MyLabel/>
            </Prov>
        );

        expect(tree).toMatchSnapshot();

    });

    it('maps logic to props', () => {

        const {Prov} = SetUp();


        const MyLabel = connect({mapLogic: {[namespace]: 'testFunc'}})((props) => {

            expect(props.testFunc).toBeInstanceOf(Function);

            return <div>mapped logic: {JSON.stringify(props, null, 4)}</div>
        });


        let tree = renderer.create(
            <Prov>
                <MyLabel/>
            </Prov>
        );

        expect(tree).toMatchSnapshot();

    });

});