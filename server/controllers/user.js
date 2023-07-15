import User from "../models/User.js";
import List from "../models/List.js";
import Entry from "../models/Entry.js";
import Book from "../models/Book.js";
import bcrypt from "bcrypt"

import {uploadFile, deleteFile, getObjectSignedUrl, sendSQSMessage} from "../lib/aws.js"

const cloudFrontBaseURL = process.env.AWS_CLOUDFRONT_BASE_URL

export const getUserByUsername = async (req, res) => {
    try{
        const userFound = await User.findOne({username: req.params.username})
            .select('-email')
        if(!userFound) return res.status(400).json({message: "No user with provided username"});
        //const imageURL = await getObjectSignedUrl(userFound._id.toString()) || ''
        //console.log("imageURL",imageURL)
        //userFound.image = imageURL
        return res.status(200).json({user: userFound})
        
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}

export const getUsers = async (req,res) => {
    try{
        var page = req.query.page ?  Number(req.query.page) : 1;
        let filter = {}
        const pageSize =  req.query.pageSize ? Number(req.query.pageSize) : 10;
        if(req.query.username) filter.username = { $regex: '.*' + req.query.username + '.*', $options: 'i' }
        if(req.query.id) filter._id = req.query.id
        const count = await User.countDocuments(filter);
        const lastPage = Math.ceil(count / pageSize);
        page = page > lastPage ? lastPage : page;
        page = page < 1 ? 1 : page;
        const offset = (page - 1) * pageSize;
        const results = await User.find(filter)
            .sort({_id: 1})
            .skip(offset)
            .limit(pageSize)
        if (!results) return res.status(400).json({message: "No results"});
        res.status(200).json({
            results,
            pageNumber: page,
            totalPages: lastPage,
            pageSize: pageSize,
            totalCount: results.length
        })
    } catch (error) {
        res.status(500).json(error)
    }

}

export const getListByUsername = async (req, res) => {
    if(!req.params.username) return res.status(400).json({message: "No username provided"})
    try{
        const userList = await List.findOne({username: req.params.username}).populate({
            path: "entries",
            populate: { 
                path: "book"
            }
        })
        if(!userList) return res.status(400).json({message: `No list found belonging to user ${req.params.username}`})
        return res.status(200).json(userList);
    } catch (error) {
        return res.status(500).json(error)
    }
}

/*
Input:
Authorized req.userID
req: {
    user: {
        image
        location
        bio

    }
}
*/
export const updateUserById = async (req, res) => {
    
    console.log("UPDATE BODY: ", JSON.parse(JSON.stringify(req.body)))
    if(req.body === {}) return res.status(401).json({message: "Invalid request, data provided"})
    
    //if(req.userId !== userId && req.role !== "admin") return res.status(401).json({message: "Not authorized to edit this user's information."})
    try {
        const file = req.file
        const { bio, location } = req.body;
        
        const foundUser = await User.findById(req.userId)
        if(!foundUser) return res.status(404).json({message: `No with user with ID ${req.userId} found`});
        
        let image = foundUser.image
        if(req.file){
            //Set image name to be the userID, there can only be one image per user
            let fileName = req.userId
            await uploadFile(req.file.buffer, fileName, file.mimetype)
            image = `${cloudFrontBaseURL}/${fileName}`
        
            
            var params = {
                MessageAttributes: {
                    UserId: {
                        DataType: "String",
                        StringValue: fileName
                    },
                    Username: {
                        DataType: "String",
                        StringValue: foundUser.username
                    },
                    ImageURL: {
                        DataType: "String",
                        StringValue: image
                    }
                },
                MessageBody: "Information to be sent to image resize worker",
                QueueUrl: process.env.AWS_SQS_URL
            };
            sendSQSMessage(params)
            //send image id to golang resizer
        }
        // TESTING RABBIT MQ
        // const channel = getChannel()
        // await channel.assertQueue('pictures');
        // const message = "The quick brown fox jumped over the lazy dog";
        // message.split(' ').forEach(word =>{
        //     channel.sendToQueue('pictures', Buffer.from(word));
        // });

        const updatedUser = await User.findByIdAndUpdate(req.userId, {bio, location, image})
        //const updatedUser = await User.findByIdAndUpdate(req.userId, {image, bio, location})
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

/*
expect:
Authorized User wants to change their username
body: {
    user: {
        password
        _id
    }
}
*/
export const updateUserPassword = async (req, res) => {
    //if(!req.body.user || !req.body.user._id || !req.body.user.password) return res.status(401).json({message: "Invalid request provided, need userId and password"})
    const { _id, password } = req.body;
    if (_id != req.userId && req.role !== 'admin') return res.status(401).json({message: "Not authorized"});
    try {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        const foundUser =  await User.findById(_id);
        if (!foundUser) res.status(400).json({message: "Somehow, this user doesn't exist"})

        foundUser.password = passwordHash
        foundUser.save( function(error, updatedUser){
            if(error) return res.status(500).json({message: "Unable to update password", error})
            updatedUser.password = undefined
            res.status(200).json(updatedUser)
        })

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

/*
expect:
Authorized User wants to change their username
body: {
    newUsername: coolNewName
}
*/
export const updateUsername = async (req, res) => {
    console.log("REQ.BODY: ",req.body);
    if (!req.body.username) return res.status(404).json({message: "No new Username provided"});
    try {
        const newUsername  = req.body.username;
        const updatedUser = await User.findByIdAndUpdate(
            req.userId, 
            {username: newUsername}, 
            {runValidators: true}, 
        )

        const updatedList = await List.findOneAndUpdate(
            {userId: updatedUser._id}, 
            {username: newUsername},
        )

        return res.status(200).json({updatedUser, updatedList});
    } catch(error) {
        res.status(500).json({message: error.message})
    }
}

/*
body: {
    email
}
*/
export const updateEmail = async (req, res) => {
    if (!req.body.email) return res.status(404).json({message: "No new email provided"});
    try {
        const { email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.userId, 
            {email: email}, 
            {runValidators: true}, 
        )

        return res.status(200).json(updatedUser);
    } catch(error) {
        res.status(500).json(error)
    }
}


/*
body: {
    userId: ;ljasldfkjasd
}
*/
export const addFollowing = async (req, res) => {
    console.log(req.body)
    if(!req.body.userId) return res.status(400).json({message: "Invalid request, must supply UserId"});
    if(req.body.userId === req.userId) return res.status(400).json({message: "You cannot follow yourself"});
    try {
        const user = await User.findById(req.userId);
        if(!user) return res.status(400).json({message: "Invalid request, somehow you got here, but you can't stay"});
        const userToFollow = await User.findById(req.body.userId)
        if(!userToFollow) return res.status(404).json({message: "No such user, cannot perform Follow operation"});
        
        const alreadyFollowing = user.following.filter((currId) => currId.equals(userToFollow.id)).at(0);
        if(alreadyFollowing) return res.status(400).json({message: "Already following provided user"});   
        
        userToFollow.followers.push(req.userId)
        const updatedFollowingUser = await userToFollow.save()
        user.following.push(userToFollow.id)
        const updatedFollowerUser = await user.save();
        res.status(200).json({
            message: "success adding follower",
            updatedDocs: {
                updatedFollowerUser,
                updatedFollowingUser
            }
        })
    } catch(error) {
        res.status(500).json(error)
    }
}

/*
body: {
    userId
}
*/
export const removeFollowing = async (req, res) => {
    if(!req.body.userId) return res.status(400).json({message: "Invalid request, must supply UserId"});
    if(req.body.userId === req.userId) return res.status(400).json({message: "You cannot unfollow yourself"});
    try {
        
        const removedFromFollower = await User.findByIdAndUpdate(req.body.userId, {$pull: {followers: req.userId}})
        const removedFromFollowing = await User.findByIdAndUpdate(req.userId, {$pull: {following: req.body.userId}})
        
        res.status(200).json({
            message: "success removing follower", 
            updatedFollowingList: removedFromFollowing.following
        })
    } catch(error) {
        res.status(500).json(error)
    }
}

/**
 * Delete user
 * AUTH required
 * @param {username} req.params
 * @returns success message
 */
export const deleteUserByUsername = async (req, res) => {
    console.log("initiating delete user");
    try{
        const userFound = await User.findOne({username: req.params.username})
        const {followers, following} = userFound;
        //delete s3 stored image file
        
        if(!userFound) return res.status(400).json({message: "No user with provided username"});
        //console.log (req.role)
        if(req.role !== "admin" && userFound._id.valueOf() !== req.userId) return res.status(400).json({message: "Not Authorized to delete this user"});
        
        //delete aws s3 stored image
        console.log("deleting s3 stored image");
        if(userFound.image.includes("cloudfront.net")){
            console.log("send delete command");
            const deleteFileResponse = await deleteFile(userFound._id)
            console.log("Delete File response: ", deleteFileResponse)
        }
        //Get entries in list  and delete them
        //decrement number of readers from all books in list
        console.log("deleting entries");
        const entriesInList = await List.findOne({userId: userFound._id})
            .populate({path: "entries", select: "book"})
            .lean()
            
        //delete entries and decrement books reader counts
        if(entriesInList.entries[0]){
            const entriesToDelete = entriesInList.entries.map(entry => entry._id);
            const booksToEdit = entriesInList.entries.map(entry => entry.book._id);
            //console.log("BOOKS: ", booksToEdit, "ENTRIES: ", entriesToDelete);
            const resultBooks = await Book.updateMany(
                {_id:
                    { $in: booksToEdit}
                },
                {
                    $inc: { readers: -1 }
            
                }
            );
            const resultEntries = await Entry.deleteMany({_id: { $in: entriesToDelete}});
            //console.log("RESULTS: ", resultEntries, resultBooks);
        }
        
        console.log("delete list");
        //delete user's list
        const deletedList = await List.findOneAndDelete({userId: userFound._id});
        console.log("deletedList: ", deletedList)

        console.log("deleting ", userFound.username, "from follow lists");
        
        //remove deleted user from all following arrays
        const removeFromFollowers = await User.updateMany(
            {_id: {$in: followers}}, 
            {$pull: {
                following: userFound._id
            }}
        )
        //remove user from all follower arrays
        const removeFromFollowing = await User.updateMany(
            {_id: {$in: following}},
            {$pull: {
                followers: userFound._id
            }}
        )

        console.log("remove from following: ", removeFromFollowing, " remove from followers: ", removeFromFollowers);

        //delete user
        console.log("delete user");
        const deletedUser = await User.findByIdAndDelete(userFound._id);
        console.log("Deleted User: ", deletedUser);
        
        return res.status(200).json({
            message: `User ${userFound.username} has been deleted, and list`,
        })
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


//Deletes currrently loggied in
export const deleteUserById = async (req,res) => {
    const { userId } = req.body
    if(!userId) return res.status(400).json({message: "Invalid userId provided"});

    if(req.role !== "admin" && userId !== req.userId) return res.status(400).json({message: "Not Authorized to delete this user"});

    try {
        //Find all entries belonging to user
        const entriesInList = await List.findOne({userId: req.userId})
            .populate({path: "entries", select: "book"})
            .lean();

        
        //delete aws s3 stored image
        if(foundUser.image!= ""){
            await deleteFile(req.userId)
        }
        //delete entries and decrement books reader counts
        if(entriesInList.entries[0]){
            const entriesToDelete = entriesInList.entries.map(entry => entry._id);
            const booksToEdit = entriesInList.entries.map(entry => entry.book._id);
            await Book.updateMany(
                {_id:
                    { $in: booksToEdit}
                },
                {
                    $inc: { readers: -1 }
            
                }
            );
            await Entry.deleteMany({_id: { $in: entriesToDelete}});
        }
        
        List.findOneAndDelete({userId: req.userId}, function (error, docs) { 
            if (error){
                return res.status(500).json(error)
            }
            else{
                console.log("Deleted List: ", docs);
            }
        });
        
        User.findByIdAndDelete(req.userId, function (err, docs) {
            if (err){
                return res.status(500).json({message: err})
            }
            else{
                console.log("Deleted User: ", docs);
            }
        });

        return res.status(200).json({
            message: `User with ID ${userId} has been deleted, and list`,
        })
        
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}


