import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import { delay } from 'redux-saga';
import { put, takeEvery, fork, all } from 'redux-saga/effects'
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-localstorage';
import thunk from 'redux-thunk';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

function* testSaga(){
    try{
//        const data = ajax(...) //Зарускаем ajax запрос и полученный ответ запишется в переменную data
//        yield put({type: "USER_FETCH_SUCCEEDED", value: data});
//        будет вызван экшен USER_FETCH_SUCCEEDED и он выведет загруженнные данные на экран
    }
    catch(e){
//        yield put({type: "USER_FETCH_FAILED"});
//        ajax запрос не удался и будет вызван экшен USER_FETCH_FAILED
    }
}
/////Ssga/////////
function* mySaga(action){
    yield takeEvery('ADD', testSaga);
    //Сага дожидается экшенов ADD и при каждом экшене она запустит метод testSaga
}

const sagaMiddleware = createSagaMiddleware();




function mainReducer(state={items:[]},action=null){
    if(action.type==='ADD'){
        return {items: [...state.items,action.value]};
    }
    if(action.type==='DATA_LOAD_SUCCEEDED'){
        alert('SUCCESS '+action.value);
        return state;
    }
    if(action.type==='DATA_LOAD_FAILED'){
        alert('FAILED');
        return state;
    }
    if(action.type==='TEST'){
        alert('TEST');
        return state;
    }
    if(action.type==='TEST2'){
        alert('TEST2');
        return state;
    }
    return state;
}



let reducer= storage.reducer(mainReducer);//Обертка для редьюсера?

const engine = createEngine('backoffice-react');// Наверное имя хранилища





const middleware = storage.createMiddleware(//Миддлвар для хранилища
    engine
);

const createStoreWithMiddleware = applyMiddleware(middleware,thunk,sagaMiddleware)(createStore);//Создаем хранилище


let store = createStoreWithMiddleware(reducer);

sagaMiddleware.run(mySaga);//Запускаем Сагу


class List extends React.Component{
    constructor(){
        super(arguments[0]);
        this.state={items: null};
}
    componentDidMount(){
        store.subscribe(()=>{
            console.dir(store.getState());

            let total=store.getState().items.map((item,i)=>{
               return <li key={i}>{item}</li>
            });
            this.setState({items: <ul>
            {total}
            </ul>})
})
}
    render(){
        return this.state.items
    }
}

//store.dispatch({type: 'ADD'});
//store.dispatch({type: 'ADD'});

function addItem(){
    store.dispatch({type: 'ADD', value: document.querySelector('input').value});
}

ReactDOM.render(
    <div>
        <List/>
        <input type='text'/>
        <button onClick={addItem}>add</button>
    </div>
    , document.getElementById('root'));



//Загрузка данных в store из localhost
const load = storage.createLoader(engine);
load(store);

load(store)
    .then((newState) => console.log('Loaded state:', newState))
.catch(() => console.log('Failed to load previous state'));



//Thunk////////////////////////////
//store.dispatch((dispatch)=>{
//    store.dispatch({type: 'TEST'});
//    store.dispatch({type: 'TEST2'});
//});
///////////////////////////////////