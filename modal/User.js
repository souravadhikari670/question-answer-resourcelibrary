const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    
    accountType:{
        type:String
    },
    name: {
        type: String,
        required: true
    },
    username:{
        type: String
    },
    bio:{
        type:String
    },
    email: {
        type: String,
        required: true
    },
    affiliationEmail:{
        type:String
    },
    affiliationEmailStatus:{
        type:Boolean,
        default:false
    },
    affiliation:{

        type:String
    },
    country:{

        type:String
    },
    type:{
        type:String
    },
    category:{
        type: String
    },
    jCategory:[{
       type:String
    }],
    impactFactor:{
        type:String
    },
    hIndex:{
        type:String
    },
    password:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    profilepic:{
        type: String,
        default: 'https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_1280.png'
    },
    activation_code:{
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    },
    contributor:{
        type: Boolean,
        default: false
    },
    topic:{
        type:[String]
    },
    follower:{
        type:[{
            uid:{
                type:Schema.Types.ObjectId,
                ref:"User"
            },
            name:{
                type: String
            },
            username:{
                type: String
            }
        }]
    },
    following:{
        type:[{
            uid:{
                type:Schema.Types.ObjectId,
                ref:"User"
            },
            name:{
                type: String
            },
            username:{
                type: String
            }
        }]
    },
    
    message:[{
        from:{
            type: String
        },
        message:String,
        view:{
            type:Boolean,
            default:false
        },
        date:String
    }],

    journal:[{
        title:{
            type:String
        },
        authors:[String],
        coauthors:[{
            uid:{
                type:Schema.Types.ObjectId,
                ref:"User"
            },
            title:String
        }],
        keyword:[{
            type:String
        }],
        description:{
            type:String
        },
        publicationdate:{
            type:String
        },
        journal:{
            type:String
        },
        volume:{
            type:String
        },
        issue:{
            type:String
        },
        pages:{
            type:String
        },
        publisher:{
            type:String
        },
        filename:{
            type:String
        },
       download:[{
           id:{
               type:Schema.Types.ObjectId,
               ref:"User"
           }
       }],
        date:{
            type:String
        }
    }],
    conference:[{
        title:{
            type:String
        },
        authors:[String],
        coauthors:[{
            uid:{
                type:Schema.Types.ObjectId,
                ref:"User"
            },
            title:String
        }],
        keyword:[{
            type:String
        }],
        description:{
            type:String
        },
        publicationdate:{
            type:String
        },
        conference:{
            type:String
        },
        volume:{
            type:String
        },
        issue:{
            type:String
        },
        pages:{
            type:String
        },
        publisher:{
            type:String
        },
        filename:{
            type:String
        },
       download:[{
           id:{
               type:Schema.Types.ObjectId,
               ref:"User"
           }
       }],
        date:{
            type:String
        }
    }],
    chapter:[{
        title:{
            type:String
        },
        authors:[String],
        coauthors:[{
            uid:{
                type:Schema.Types.ObjectId,
                ref:"User"
            },
            title:String
        }],
        keyword:[{
            type:String
        }],
        description:{
            type:String
        },
        publicationdate:{
            type:String
        },
        book:{
            type:String
        },
        volume:{
            type:String
        },
        pages:{
            type:String
        },
        publisher:{
            type:String
        },
        filename:{
            type:String
        },
       download:[{
           id:{
               type:Schema.Types.ObjectId,
               ref:"User"
           }
       }],
        date:{
            type:String
        }
    }],
    book:[{
        title:{
            type:String
        },
        authors:[String],
        coauthors:[{
            uid:{
                type:Schema.Types.ObjectId,
                ref:"User"
            },
            title:String
        }],
        keyword:[{
            type:String
        }],
        description:{
            type:String
        },
        publicationdate:{
            type:String
        },
        volume:{
            type:String
        },
        pages:{
            type:String
        },
        publisher:{
            type:String
        },
        filename:{
            type:String
        },
       download:[{
           id:{
               type:Schema.Types.ObjectId,
               ref:"User"
           }
       }],
        date:{
            type:String
        }
    }],
    thesis:[{
        title:{
            type:String
        },
        authors:[String],
        coauthors:[{
            uid:{
                type:Schema.Types.ObjectId,
                ref:"User"
            },
            title:String
        }],
        keyword:[{
            type:String
        }],
        description:{
            type:String
        },
        publicationdate:{
            type:String
        },
        institution:{
            type:String
        },
        filename:{
            type:String
        },
       download:[{
           id:{
               type:Schema.Types.ObjectId,
               ref:"User"
           }
       }],
        date:{
            type:String
        }
    }],
    patent:[{
        title:{
            type:String
        },
        inventors:[String],
        coauthors:[{
            uid:{
                type:Schema.Types.ObjectId,
                ref:"User"
            },
            title:String
        }],
        keyword:[{
            type:String
        }],
        description:{
            type:String
        },
        publicationdate:{
            type:String
        },
        patentoffice:{
            type:String
        },
        patentnumber:{
            type:String
        },
        applicationnumber:{
            type:String
        },
       download:[{
           id:{
               type:Schema.Types.ObjectId,
               ref:"User"
           }
       }],
        date:{
            type:String
        }
    }],
    courtcase:[{
        title:{
            type:String
        },
        coauthors:[{
            uid:{
                type:Schema.Types.ObjectId,
                ref:"User"
            },
            title:String
        }],
        keyword:[{
            type:String
        }],
        court:{
            type:String
        },
        description:{
            type:String
        },
        decideddate:{
            type:String
        },
        reporter:{
            type:String
        },
        docketid:{
            type:String
        },
       download:[{
           id:{
               type:Schema.Types.ObjectId,
               ref:"User"
           }
       }],
        date:{
            type:String
        }
    }],

    question:[{
        text: {
            type: String,
            require: true
        },
        code: {
            type: String,
        },
        upvotes: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
        }],
        downvotes:[{
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
        }],
        answers: {
            type: [{
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User"
                },
                anstext: {
                    type: String,
                },
                anscode:{
                    type: String
                },
                name: {
                    type: String
                },
                username: {
                    type: String,
                },
                date: {
                    type: String
                },
                upvotes: [{
                    user: {
                        type: Schema.Types.ObjectId,
                        ref: "User"
                    },
                }],
                downvotes:[{
                    user:{
                        type: Schema.Types.ObjectId,
                        ref:"User"
                    }
                }],
            }]
        },
        tag:{
            type: [String]
        },
        date: {
            type: String
        },
        followquestion:[{
            id:{
                type:Schema.Types.ObjectId,
                ref:"User"
            }
        }]
    }],

    videofile: [{
        access: {
            type:Boolean,
            default: true
        }, username: {
            type: String
        },
        topic: {
            type : String
        },
        tag: {
            type: [String]
        },
        title:{
            type:String
        },
        description:{
            type: String
        },
        filename:{
            type:String
        },
        date: {
            type: String
        },
       
    }],
    txtfile: [{
        access: {
            type:Boolean,
            default: true
        },
        username: {
            type: String
        },
        topic: {
            type : String
        },
        tag:{
            type: [String]
        },
        title:{
            type:String
        },
        description:{
            type: String
        },
        filename: {
            type:String
        },
        date: {
            type: String
        },
    }],
    timeline:[{
        
        username:{
           type:String
        },
        postusername:{
            type:String
        },
        id:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        tag:{
            type:String,
        },
        title:{
            type:String
        },
        date:{
            type:String
        }
    }],
    followquestion:[{
        id:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        title:{
            type:String
        },
        username:{
            type:String
        },
    }],
    questionnotification:[{

        id:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        tag:{
            type:String
        },
        title:{
            type:String
        },
        uid:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        username:{
            type:String
        },
        view:{
            type:Boolean,
            default:false
        },
        date:{
            type:String
        }
    }],
    resourcenotification:[{
        
        id:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        tag:{
            type:String
        },
        title:{
            type:String
        },
        uid:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        username:{
            type:String
        },
        view:{
            type:Boolean,
            default:false
        },date:{
            type:String
        }
    }],
    researchnotification:[{
        id:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        tag:{
            type:String
        },
        title:{
            type:String
        },
        username:{
            type:String
        },
        uid:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        view:{
            type:Boolean,
            default:false
        },
        date:{
            type:String
        }

    }]
})

const thisSchema = mongoose.model('User', UserSchema)
module.exports = thisSchema