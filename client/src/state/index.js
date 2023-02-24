import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    mode: "light",
    user: {username: "Fake User", name: {First: "Josh", Last: "Strozzi"}},
    token: null,
    posts: [],
    list: [],
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setList: (state, action) => {
            state.list = action.payload.list
        },
        setPosts: (state,action) => {
            state.posts = action.payload.posts
        },
        setEntry: (state, action) => {
            const updatedList = state.list.map((entry) => {
                if (entry._id === action.payload.entry_id) return action.payload.entry
                return entry;
            })
            state.list = updatedList
        },
        setPost: (state, action) =>{
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post_id) return action.payload.post
                return post;
            });
            state.posts=updatedPosts
        }
    },
    
})

export const { setEntry, setMode, setList, setLogin, setLogout, setPost, setPosts} = authSlice.actions;
export default authSlice.reducer;