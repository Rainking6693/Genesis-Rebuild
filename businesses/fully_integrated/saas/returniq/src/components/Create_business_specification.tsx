import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SetUserNameAction, RootState } from './store';
import { setUserName } from './store/actions';

interface Props {
  initialName?: string;
}

const MyComponent: React.FC<Props> = ({ initialName }) => {
  const dispatch = useDispatch<typeof setUserName>();
  const userName = useSelector((state: RootState) => state.userName);
  const [localUserName, setLocalUserName] = useState<string | null>(null);

  useEffect(() => {
    if (dispatch && initialName) {
      dispatch(setUserName(initialName));
    }

    if (dispatch && !userName && !localUserName) {
      // Set a default local user name for edge cases
      setLocalUserName('Guest');
    }
  }, [dispatch, initialName, userName]);

  useEffect(() => {
    if (dispatch && localUserName && !userName) {
      dispatch(setUserName(localUserName));
    }
  }, [dispatch, localUserName, userName]);

  if (userName) {
    return <h1>Hello, {userName}!</h1>;
  }

  if (localUserName) {
    return (
      <>
        <h1>Hello, {localUserName}! Please log in to continue...</h1>
      </>
    );
  }

  return <h1>Please log in to continue...</h1>;
};

export default MyComponent;

// Adding a type for the store state
interface RootState {
  userName: string | null;
}

// Adding action creator for setting user name
interface SetUserNameAction {
  type: 'SET_USER_NAME';
  payload: string;
}

const setUserName = (name: string): SetUserNameAction => ({
  type: 'SET_USER_NAME',
  payload: name,
});

// Adding reducer for handling SET_USER_NAME action
interface InitialState {
  userName: string | null;
}

const initialState: InitialState = {
  userName: null,
};

const reducer = (state: InitialState | null = initialState, action: SetUserNameAction) => {
  if (!state || !action) return state;

  switch (action.type) {
    case 'SET_USER_NAME':
      return { ...state, userName: action.payload };
    default:
      return state;
  }
};

// Adding store creation and provider
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootReducer } from './reducers';

const store = createStore<RootState, SetUserNameAction, {}, RootState>(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SetUserNameAction, RootState } from './store';
import { setUserName } from './store/actions';

interface Props {
  initialName?: string;
}

const MyComponent: React.FC<Props> = ({ initialName }) => {
  const dispatch = useDispatch<typeof setUserName>();
  const userName = useSelector((state: RootState) => state.userName);
  const [localUserName, setLocalUserName] = useState<string | null>(null);

  useEffect(() => {
    if (dispatch && initialName) {
      dispatch(setUserName(initialName));
    }

    if (dispatch && !userName && !localUserName) {
      // Set a default local user name for edge cases
      setLocalUserName('Guest');
    }
  }, [dispatch, initialName, userName]);

  useEffect(() => {
    if (dispatch && localUserName && !userName) {
      dispatch(setUserName(localUserName));
    }
  }, [dispatch, localUserName, userName]);

  if (userName) {
    return <h1>Hello, {userName}!</h1>;
  }

  if (localUserName) {
    return (
      <>
        <h1>Hello, {localUserName}! Please log in to continue...</h1>
      </>
    );
  }

  return <h1>Please log in to continue...</h1>;
};

export default MyComponent;

// Adding a type for the store state
interface RootState {
  userName: string | null;
}

// Adding action creator for setting user name
interface SetUserNameAction {
  type: 'SET_USER_NAME';
  payload: string;
}

const setUserName = (name: string): SetUserNameAction => ({
  type: 'SET_USER_NAME',
  payload: name,
});

// Adding reducer for handling SET_USER_NAME action
interface InitialState {
  userName: string | null;
}

const initialState: InitialState = {
  userName: null,
};

const reducer = (state: InitialState | null = initialState, action: SetUserNameAction) => {
  if (!state || !action) return state;

  switch (action.type) {
    case 'SET_USER_NAME':
      return { ...state, userName: action.payload };
    default:
      return state;
  }
};

// Adding store creation and provider
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootReducer } from './reducers';

const store = createStore<RootState, SetUserNameAction, {}, RootState>(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;