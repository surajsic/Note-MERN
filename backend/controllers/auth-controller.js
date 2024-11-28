const User = require("../models/user-models");
const Note = require("../models/notes-models");

const jwt = require("jsonwebtoken");


const home= async (req,res)=>{
    try {
        res.status(200).send("Hey Router");
    } catch (error) {
        res.status(400).send({msg:"Router Not Connected"})
    }
}

const createAccount = async (req,res)=>{
    try {
        const {fullName, email, password} = req.body;
        if (!fullName) {
            return res
                .status(400)
                .json({error: true, message:"Full Name required"})
        }
    
        if (!email) {
            return res
                .status(400)
                .json({error: true, message:"Email required"})
        }
    
        if (!password) {
            return res
                .status(400)
                .json({error: true, message:"Password required"})
        }
    
        const isUser = await User.findOne({email:email });
    
        if(isUser){
            return res.json({
                error:true,
                message:"User Already Exists"
            });
        }
    
        const user = new User({
            fullName,
            email,
            password
        });
    
        await user.save();
        
        const accessToken= jwt.sign({ user }, 
            process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "36000m",
            });
        
        return res.json({
            error:false,
            user,
            accessToken,
            message:"Registration Successful",
        });        
        
    } catch (error) {
        res.status(500).json("internal server error")
    }    
}

const login = async (req,res)=>{
    try {
        const {email, password} = req.body;

        if (!email) {
            return res.status(400).json({message:"Email is required"})
        }

        if (!password) {
            return res.status(400).json({message:"Password is required"})
        }

        const userInfo = await User.findOne({email:email});

        if (!userInfo) {
            return res.status(400).json({message:"User Not Found"});
        }

        if (userInfo.email === email && userInfo.password === password) {
            const user ={user: userInfo};
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn:"36000m",
            });

            return res.json({error:false,
                message:"Login Successful",
                email,
                accessToken,
            })
        }
        else {
            return res.status(400).json({error:true,
                message:"Invalid Credentials",
            })
        }
        
    } catch (error) {
        res.status(500).json("internal server error");
    }
}

const getUser = async(req, res)=>{
    try {
        const {user}= req.user;
        const isUser= await User.findOne({_id: user._id})
        
        if (!user) {
            return res.sendStatus(401)
        }

        return res.json({
            user: {
                fullName: isUser.fullName, 
                email:isUser.email, 
                "_id": isUser._id, 
                createdOn: isUser.createdOn,
            },
            message:""
        })
    } catch (error) {
        
    }
}

const addNote=  async(req, res)=>{
    try {

    const{title, content, tags} = req.body;
    const {user} = req.user;

    if (!title) {
        return res.status(400).json({error:true, message:"Title Required"});
    }

    if (!content) {
        return res.status(400).json({error:true, message:"Content Required"});
    }

    if (!tags) {
        return res.status(400).json({error:true, message:"Tags Required"});
    }

        const note = new Note({
            title, 
            content, 
            tags: tags || [],
            userId: user._id,
        })

        await note.save();

        return res.json({
            error:false,
            note, 
            message:"Note Added Successfully",
        })

    } catch (error) {
        res.status(500).json({
            error: true, 
            message:"internal server error"
        });    
    }

}

const editNote = async (req, res)=>{
    const noteId = req.params.noteId;
        const {title, content, tags, isPinned} = req.body;
        const {user}= req.user;

        if (!title && !content && !tags) {
            return res.status(400).json({
                error:true, 
                message:"No Changes provided"
            });
        }

        try {     
        const note = await Note.findOne({ _id: noteId,
            userId: user._id,
        })

        if (!note) {
            return res.status(404).json({error:true, message:"Notes Not found"});
        }
     
        if (title) note.title=title;
        if (content) note.content= content;
        if (tags) note.tags=tags;
        if (isPinned) note.isPinned=isPinned;
        
        await note.save();

        return res.json({
            error:false,
            note,
            message:"Note Updates Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            error:true,
            message:"Internal Server Error"
        })
    }
}

const getAllNotes = async (req, res)=>{
    try {
        const {user} = req.user
        const notes = await Note.find({userId: user._id}).sort({isPinned: -1});

        return res.json({error:false,
            notes,
            message:"All notes received successfully"
        });
    } catch (error) {
        return res.status(500).json({
            error:true,
            message:"Internal Server Error"
        });
    }
}

const deleteNotes = async (req, res)=>{
    try {
        const noteId= req.params.noteId;
        const { user } = req.user;

        const note = await Note.findOne({_id: noteId, userId: user._id})

        if (!note) {
            return res.status(404).json({error:true, message:"Notes not found"})
        }

        await Note.deleteOne({_id:noteId, userId:user._id})

        return res.json({
            error:true,
            message:"Note Deleted Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            error:true,
            message:"Internal Server Error"
        })
    }
}

const updateNoteIsPinned = async (req, res)=>{
    
        const noteId = req.params.noteId;
            const { isPinned} = req.body;
            const {user} = req.user;
    try {  
            const note = await Note.findOne({ _id: noteId,
                userId: user._id,
            })
    
            if (!note) {
                return res.status(404).json({error:true, message:"Notes Not found"});
            }
         
            note.isPinned=isPinned;
            
            await note.save();
    
            return res.json({
                error:false,
                note,
                message:"Note Updates Successfully"
            })
        } 
        catch (error) {
            return res.status(500).json({
                error:true,
                message:"Internal Server Error"
            })
        }
}

const searchNotes = async(req, res) =>{
    try {
        const {user} = req.user;
        const {query} = req.query;

        if (!query) {
            return res.status(400).json({error:true, message: "Search query is required"})
        }

        const matchingNotes = await Note.find({
            userId: user._id,
            $or:[
                {title: { $regex: new RegExp(query, "i") } },
                {content: {$regex: new RegExp(query, "i") } },
            ],
        });
        return res.json({
            error:false,
            notes:matchingNotes,
            message:"Notes Matching the search query retrieved successfully",
        })
    } catch (error) {
        return res.status(500).json({error:true, message:"Internal Server Error"})
    }
}

module.exports= {home, createAccount, login, addNote, editNote, getAllNotes, deleteNotes, updateNoteIsPinned, getUser, searchNotes}