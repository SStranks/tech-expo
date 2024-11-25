/* eslint-disable @typescript-eslint/no-restricted-imports */
import type { ReduxDispatch, ReduxState, ReduxStore } from './store';

import { useDispatch, useSelector, useStore } from 'react-redux';

export const useReduxDispatch = useDispatch.withTypes<ReduxDispatch>();
export const useReduxSelector = useSelector.withTypes<ReduxState>();
export const useReduxStore = useStore.withTypes<ReduxStore>();
