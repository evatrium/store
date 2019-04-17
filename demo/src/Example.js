import React, {Component} from 'react'
import {createStore} from "../../src";
import {createActions} from "../../src/createActions";
import {Provider, connect} from "../../src/connect";

const store = createStore();

let actions = {};
const getActions = () => actions;

const initialState = {count: 0, name: 'MyApp'};

store.attachState({app: initialState});
createActions("app", initialState, store, actions);
/*
    {app: {set,get,merge,update,toggle}}
 */

const clicky = () => {
    actions.app.update(state => ({...state, count: state.count + 1}));
};


const Counter = connect({
    mapState: {app: 'count,name'},
    mapActions: {app: 'set'}
})(({count, name, set}) => (
    <div>
        <h3>{name}</h3>
        <button onClick={() => set.count(count + 1)}>increment: {count}</button>
    </div>
));

export class Example extends Component {
    render() {
        return (
            <Provider store={store} actions={{getActions}}>

                <nav className={'nav'}/>
                <Counter/>
                <button onClick={clicky}>tester</button>

            </Provider>
        );
    }
}