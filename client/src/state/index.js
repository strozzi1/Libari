import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    mode: "light",
    user: {username: "default"},
    token: null,
    posts: [],
    //current list being looked at
    list: [],
    //loggedIn user's list, for quick loading of the most viewed list
    entries: [],
    //logged in user's books, for comparisons
    books: []
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
            state.entries = action.payload.list;
            state.books = action.payload.list.map((entry) => entry.book)
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
            state.list = [];
            state.books = [];
            state.posts = [];
            state.entries = [];
        },
        //likely moved to it's own slice later
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
        },
        addRemoveFollowing:(state, action) => {
            if(state.user.following.includes(action.payload.id)){
                state.user.following = state.user.following.filter((id)=> id!==action.payload.id)
            } else {
                state.user.following.push(action.payload.id)
            }
        }
    },
    
})

export const { setEntry, setMode, setList, setLogin, setLogout, setPost, setPosts, addRemoveFollowing} = authSlice.actions;
export default authSlice.reducer;