var userDB = require("../model/model");
const validate = require("../../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// creating and saving user

exports.create = async(req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "content is empty. cannot be empty" });
        return;
    }
    //validate data
    const checked = validate.checkRegister(req.body);
    if (checked != true) return res.status(400).send(checked[0].message);

    //already exist?
    try {
        const emailExists = await userDB.findOne({ email: req.body.email });
        if (emailExists) return res.status(400).send("email already exist");
    } catch (err) {
        console.log(err);
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new userDB({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    });

    //save user to db

    user
        .save(user)
        .then((data) => {
            res.redirect("/login");
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "some error while sending to db",
            });
        });
};

//login
exports.login = async(req, res) => {
    //validate data
    console.log(req.body);
    const checked = validate.checkLogin(req.body);
    if (checked != true) return res.status(400).send(checked);

    //already exist?
    const user = await userDB.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("email/password incorrect ");

    //has the password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("email/password incorrect ");

    //create and give tokenes
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token);

    try {
        res.redirect(`/to-do/${token}`);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

//GET single user

exports.find = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;
        userDB
            .findById(id)
            .then((data) => {
                if (!data) {
                    res.status(404).send({ message: "didnt find the user with id" + id });
                } else {
                    res.send(data);
                }
            })
            .catch((err) => {
                res
                    .status(500)
                    .send({ message: err + "err retrieving user with id" + id });
            });
    } else {
        userDB
            .find()
            .then((user) => {
                res.send(user);
            })
            .catch((err) => {
                res
                    .status(500)
                    .send({ message: err.message || "some error while getting from db" });
            });
    }
};

//update user
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Data to update can not be empty" });
    }
    const id = req.params.id;
    userDB
        .findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
            if (!data) {
                res
                    .status(400)
                    .send({ message: `cannot update with ${id}.maybe not found` });
            } else {
                res.send(data);
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "error in updating" });
        });
};

//delete user
exports.delete = (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Data to delete can not be empty" });
    }
    const id = req.params.id;
    userDB
        .findByIdAndDelete(id)
        .then((data) => {
            if (!data) {
                res
                    .status(400)
                    .send({ message: `cannot delete with ${id}.maybe not found` });
            } else {
                res.send("deldeted succesfull");
            }
        })
        .catch((err) => {
            res.status(500).send({ message: "error in deleting" });
        });
};

//handel todo

//get todo with id
exports.getTodo = (req, res) => {
    if (req.params.token) {
        const user = jwt.verify(req.params.token, process.env.TOKEN_SECRET);
        const id = user._id;
        userDB
            .findById(id)
            .then((data) => {
                if (!data) {
                    res.status(404).send({ message: "didnt find the user with id" + id });
                } else {
                    res.send(data);
                }
            })
            .catch((err) => {
                res
                    .status(500)
                    .send({ message: err + "err retrieving user with id" + id });
            });
    } else {
        res.send("invalid token");
    }
};

//create todo
exports.postTodo = async(req, res) => {
    console.log("inside backend end posttodo");
    if (req.params.token) {
        //verify token
        var user = jwt.verify(req.params.token, process.env.TOKEN_SECRET);
        const id = user._id;
        //get all info of user
        userDB
            .findById(id)
            .then((data) => {
                console.log("req from fetch todo save : " + req.body);
                if (!data) {
                    res.status(404).send({ message: "didnt find the user with id" + id });
                } else {
                    //make it
                    const userdata = {
                        name: data.name,
                        email: data.email,
                        password: data.password,
                        to_do: req.body,
                    };
                    //update
                    userDB
                        .findByIdAndUpdate(id, userdata, { useFindAndModify: false })
                        .then((data) => {
                            if (!data) {
                                res.status(400).send({
                                    message: `cannot add todo to user with id ${id}.maybe not found`,
                                });
                            } else {
                                res.send(data);
                            }
                        })
                        .catch((err) => {
                            res.status(500).send({ message: "error in adding todo to user" });
                        });
                }
            })
            .catch((err) => {
                res
                    .status(500)
                    .send({ message: err + "err retrieving user with id" + id });
            });
    } else {
        res.send("invalid token");
    }
};