import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        lower: true,
        required: [true, "Please provide user name"],
    },
    image: {
        type: String,
        required: [true, "Please provide the Image of the member"]
    },
    position: {
        type: String,
        trim: true,
        lower: true,
        required: [true, "Please provide user name"],
    },
    description: {
        type: String,
        trim: true,
        lower: true,
        required: [true, "Please provide a User Bio"],
    },
    freelancerLink: {
        type: String,
        trim: true,
        lower: true,
    },
    facebookLink: {
        type: String,
        trim: true,
        lower: true,
    },
    twitterLink: {
        type: String,
        trim: true,
        lower: true,
    },
    instagramLink: {
        type: String,
        trim: true,
        lower: true,
    },

});

const TeamMember = mongoose.models.TeamMember || mongoose.model("TeamMember", teamMemberSchema);

export default TeamMember;