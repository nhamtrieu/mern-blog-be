import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            unique: true,
            required: true,
        },
        image: {
            type: String,
            default:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1cDrRVQH5Q1JJPnIzoeg25aKJTYKDr1N3YQ&usqp=CAU",
        },
        category: {
            type: String,
            default: "uncategorized",
        },
        slug: {
            type: String,
            unique: true,
            required: true,
        },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
