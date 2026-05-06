console.log();
// import type { UnknownAction } from '@reduxjs/toolkit';

// import { isAnyOf } from '@reduxjs/toolkit';

// import { listenerMiddlewareStartListening } from '@Redux/listenerMiddleware';

// import { deleteSaveRequest } from './pipeline.slice';
// import { createDealThunk, deleteDealThunk, moveDealThunk } from './pipeline.thunks';

// const entityActions = {
//   create: {
//     thunk: createDealThunk,
//     getEntityId: (action: ReturnType<typeof createDealThunk.pending>) => action.meta.requestId,
//   },
//   delete: {
//     thunk: deleteDealThunk,
//     getEntityId: (action: ReturnType<typeof deleteDealThunk.pending>) => action.meta.arg.dealId,
//   },
//   move: {
//     thunk: moveDealThunk,
//     getEntityId: (action: ReturnType<typeof moveDealThunk.pending>) => action.meta.arg.sourceDealId,
//   },
// } as const;

// const lifecycle = {
//   fulfilled: Object.values(entityActions).map((a) => a.thunk.fulfilled),
//   pending: Object.values(entityActions).map((a) => a.thunk.pending),
//   rejected: Object.values(entityActions).map((a) => a.thunk.rejected),
// } as const;

// const isEntityPending = isAnyOf(...lifecycle.pending);
// const isEntityRejected = isAnyOf(...lifecycle.rejected);
// const isEntityFulfilled = isAnyOf(...lifecycle.fulfilled);

// function getEntityId(action: UnknownAction): string {
//   for (const { getEntityId, thunk } of Object.values(entityActions)) {
//     if (thunk.pending.match(action)) {
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
//       return getEntityId(action as any);
//     }
//   }
//   throw new Error('Unexpected action type');
// }

// listenerMiddlewareStartListening({
//   matcher: isEntityPending,
//   effect: (action, listenerApi) => {
//     listenerApi.dispatch(
//       saveRequestPending({
//         entityId: getEntityId(action),
//         requestId: action.meta.requestId,
//         status: 'pending',
//       })
//     );
//   },
// });

// listenerMiddlewareStartListening({
//   matcher: isEntityRejected,
//   effect: (action, listenerApi) => {
//     const { requestId } = action.meta;
//     listenerApi.dispatch(saveRequestRejected({ requestId }));
//   },
// });

// listenerMiddlewareStartListening({
//   matcher: isEntityFulfilled,
//   effect: async (action, listenerApi) => {
//     const { requestId } = action.meta;

//     await listenerApi.delay(2000);

//     const state = listenerApi.getState();
//     const req = state.scrumboardPipeline.saveRequests[requestId];

//     if (req?.status === 'fulfilled') {
//       listenerApi.dispatch(deleteSaveRequest({ requestId }));
//     }
//   },
// });
