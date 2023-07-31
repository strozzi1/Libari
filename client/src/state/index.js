import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { BASE_URL } from '../env';


const initialState = {
    mode: "light",
    user: null,
    token: null,
    posts: [],
    //loggedIn user's list, for quick loading of the most viewed list & comparisons 
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
            localStorage.setItem("token", action.payload.token)
            
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
            state.books = [];
            state.posts = [];
            state.entries = [];
            localStorage.clear()
        },
        updateUsername: (state, action ) => {
            state.user.username = action.payload.username
        },
        //likely moved to it's own slice later
        setPosts: (state,action) => {
            state.posts = action.payload.posts
        },
        addEntry: (state, action) => {
            /*TODO don't push null books to list */
            let newEntry = {...action.payload.entry, book:action.payload.book}
            state.entries.push(newEntry)
            state.books.push(action.payload.book)
            //console.log("state: ", state, "action: ", action)
            
            return action
        },
        setEntry: (state, action) => {
            
            state.entries = state.entries.map((entry) => {
            if (entry._id === action.payload._id) {
                entry.review = action.payload.review;
                entry.status = action.payload.status;
                entry.rating = action.payload.rating;
                entry.startDate = action.payload.startDate;
                entry.endDate = action.payload.endDate;
                entry.page = action.payload.page;
                entry.favorite = action.payload.favorite;
            }
            
            return entry;
            });
        },
        removeEntry: (state, action) => {
            const updatedList = state.entries.filter((entry)=> entry._id !== action.payload.deletedEntry)
            state.entries = updatedList
            return action;
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
    extraReducers: (builder) => {
        builder.addCase(updateEntry.fulfilled, (state, action) => {
            // Update the state based on the result of the async action
            // If the action.payload contains the updated entry, you can just call the setEntry reducer
            authSlice.caseReducers.setEntry(state, action);
        });

        builder.addCase(addNewEntry.fulfilled, (state,action) => {
            authSlice.caseReducers.addEntry(state, action);
        });

        builder.addCase(deleteEntry.fulfilled, (state,action) => {
            authSlice.caseReducers.removeEntry(state, action);
        });

        builder.addCase(googleLogin.fulfilled, (state, action)=> {
            authSlice.caseReducers.setLogin(state, action)
        });

        builder.addCase(googleRegister.fulfilled, (state, action)=> {
            authSlice.caseReducers.setLogin(state, action)
        });
    },
})

export const googleLogin = createAsyncThunk(
    "auth/googleLogin",
    async ({credential}, thunkAPI) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/googleLogin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    credential
                }),
            });

            const data = await response.json();

            if(!response.ok){
                console.log("googleLogin", data)
                throw new Error(data.message);
            }

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err)
        }
    }
);

export const googleRegister = createAsyncThunk(
    "auth/googleRegister",
    async ({credential}, thunkAPI) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/googleRegister`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    credential
                }),
            });
            const data = await response.json();
            console.log("google reg: ", data)

            if(!response.ok){
                throw new Error(data.message);
            }

            return data;
        } catch (err) {
            console.log("Google Register Error: ", err)
            return thunkAPI.rejectWithValue(err)
        }
    }
);

export const updateEntry = createAsyncThunk(
    "auth/updateEntry",
    async ({ entry, token }, thunkAPI) => {
        console.log("In updateEntry action: ", entry)
        try {
            const response = await fetch(`${BASE_URL}/entry/${entry._id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    entry: entry,
                }),
            });
            const data = await response.json();
            return data;
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err);
        }
    }
);

export const addNewEntry = createAsyncThunk(
    "auth/addEntry",
    async ({ entry, book, token }, thunkAPI) => {
    try {
        const response = await fetch(`${BASE_URL}/entry/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            entry,
            book
        }),
        });
        if(!response.ok){
            throw new Error('Unable to complete action at this time')
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
        return thunkAPI.rejectWithValue(err);
    }
});

//Don't use until I can add books, easier for prototyping
export const deleteEntry = createAsyncThunk(
    "auth/deleteEntry",
    async({entryId, token}, thunkAPI) => {
        try {
            const response = await fetch(`${BASE_URL}/entry/${entryId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            
            });
            if(!response.ok){
                throw new Error("Unable to complete Delete action at this time")
            }
            const data = await response.json();
            return data;
        } catch (err) {
            console.log(err);
            return thunkAPI.rejectWithValue(err);
        }
    }
)



export const { setMode, setList, setLogin, setLogout, setPost, setPosts, addRemoveFollowing, removeEntry, setEntry, updateUsername} = authSlice.actions;
export default authSlice.reducer;


