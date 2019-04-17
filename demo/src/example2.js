import React from 'react'
import {render} from 'react-dom'
import './styles.css';
import {createStore} from "../../src";
import {createActions} from "../../src/createActions";
import {Provider as Prov, connect} from "../../src/_willBeDepreciated";

/**
 *
 *
 * --- AND THIS IS WHERE @IOSIO/CAPSULE COMES IN TO DO ALL OF THIS FOR YOU AND MUCH MORE
 *
 */

//logic.js

const store = createStore();

let actions = {};
const getActions = () => actions;

export const cap = ({name, initialState, mapState, mapActions}) => {
    store.attachState({[name]: initialState});
    createActions(name, initialState, store, actions);
    return (Component) => connect({mapState, mapActions})(Component);
};

export const Provider = (props) => (
    <Prov store={store} actions={{getActions}}>
        <React.Fragment>
            {props.children}
        </React.Fragment>
    </Prov>
);


//index.js

const Counter = cap({
    name: 'home',
    initialState: {count: 0, name: 'MyApp'},
    mapState: {home: 'count,name'},
    mapActions: {home: 'set'}
})(({count, name, set}) => (
    <div>
        <h3>{name}</h3>
        <button onClick={() => set.count(count + 1)}>increment: {count}</button>
    </div>
));


class Demo extends React.Component {
    render() {
        return (
            <Provider>
                <React.Fragment>
                    <nav className={'nav'}/>
                    <Counter/>
                </React.Fragment>
            </Provider>
        );
    }
}


render(<Demo/>, document.querySelector('#demo'));
