const express = require('express');
const zod = require('zod');
const {User, Account} = require("../db");
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');
const {authMiddleware} = require('../middleware');
const bcrypt = require("bcrypt");

const router = express.Router();




const signupBody = zod.object({
    username : zod.string(),
    password : zod.string(),
    firstName : zod.string(),
    lastName : zod.string(),
})


router.post("/signup", async (req, res) => {
    try {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }
    console.log(req.body);
    const {
        username , password, firstName , lastName
    } = req.body ;
    console.log(username , firstName); 
    const user = await User.create({
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
    })
    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
}
catch (e) {

    console.log(e.message);
    return res.status(500).json({
        message : e.message
    });


}
})

const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post('/signin', async (req,res) => {

    const body = req.body;
    const {success} = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username : body.username,
        password : body.password
    });

    if (user) {
        const token = jwt.sign({
            userId : User._id
        },JWT_SECRET);

        res.json({
            token : token
        })
        return;
    }
    res.status(411).json({
        message: "Error while logging in"
    })

});

const updateBody = zod.object({
    password : zod.string().optional(),
    firstName : zod.string().optional(),
    lastName : zod.string().optional(),
})

router.put('/' , async (req,res) => {
    const body = req.body
    const {success} = updateBody.safeParse(req.body)
    if (!success) {
        return res.send(411).json({
            message: "Error while updating information"
        })
    }
    await User.updateOne({
        _id : req.userId
    } , req.body);

    res.json({
        message: "Updated successfully"
    })


});

router.put('/bulk', async (req,res) => {
    const query = req.query.filter || "" ;
    const users = await User.find({
        $or:[{
        firstName : {
            "$regex" : filter
        },
        lastName : {
            "$regex" : filter
        }
    }]
    })
    

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
});


module.exports = router;