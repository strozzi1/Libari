import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

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
        //likely moved to it's own slice later
        setPosts: (state,action) => {
            state.posts = action.payload.posts
        },
        addEntry: (state, action) => {
            /*TODO don't push null books to list */
            let newEntry = {...action.payload.entry, book:action.payload.book}
            state.entries.push(newEntry)
            state.books.push(action.payload.book)
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
            }
            return entry;
            });
        },
        removeEntry: (state, action) => {
            const updatedList = state.entries.filter((entry)=> entry._id !== action.payload.deletedEntry)
            state.entries = updatedList
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
            authSlice.caseReducers.addEntry(state,action);
        });
        builder.addCase(deleteEntry.fulfilled, (state,action) => {
            authSlice.caseReducers.removeEntry(state,action);
        });
    },
})

export const updateEntry = createAsyncThunk(
    "auth/updateEntry",
    async ({ entry, token }, thunkAPI) => {
    console.log("In updateEntry action: ", entry)
    try {
        const response = await fetch(`http://localhost:5001/entry/${entry._id}`, {
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
});

export const addNewEntry = createAsyncThunk(
    "auth/addEntry",
    async ({ entry, book, token }, thunkAPI) => {
    try {
        const response = await fetch(`http://localhost:5001/entry/`, {
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
            const response = await fetch(`http://localhost:5001/entry/${entryId}`, {
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

export const { setMode, setList, setLogin, setLogout, setPost, setPosts, addRemoveFollowing, removeEntry, setEntry} = authSlice.actions;
export default authSlice.reducer;