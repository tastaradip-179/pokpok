import { configureStore } from '@reduxjs/toolkit'
import loggedinUser from './slices/loggedinUser';
import activeChatSlice from './slices/activeChat';

export default configureStore({
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    }),
    reducer: {
        userLoginInfo: loggedinUser,
        activeUserChat: activeChatSlice,
    },
});

