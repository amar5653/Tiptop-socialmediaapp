import mongoose from "mongoose";

const postSchema =  mongoose.Schema(
{
 userId : {
    type: Number,
    required: true
 },
 firstName : {
    type: String,
    required: true
 },
 lastName : {
    type: String,
    required: true
 },
 location: String,
 description: String,
 picturePath: String,
 userPicturePath: String,
 likes: {
    type: Map,
    of: Boolean,
 },
 comments: {
    type: Array,
    default: []
 }
},
{timeStamps: true}
)
const post = mongoose.model("Post", postSchema);

export default Post;