import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./modules";
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import ReduxThunk from 'redux-thunk';

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(ReduxThunk))
);

export default store;