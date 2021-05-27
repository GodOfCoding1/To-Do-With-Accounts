const axios = require("axios");
const { token } = require("morgan");
const jwt = require("jsonwebtoken");

exports.home = (req, res) => {
    res.render("to_do");
};

exports.admin = (req, res) => {
    axios
        .get("http://localhost:3000/api/users")
        .then(function(response) {
            console.log(req);
            res.render("admin", { users: response.data });
        })
        .catch((err) => {
            res.send(err);
        });
};

exports.add_user = (req, res) => {
    res.render("add-user");
};
exports.login = (req, res) => {
    res.render("login");
};

exports.update_user = (req, res) => {
    axios
        .get("http://localhost:3000/api/users", {
            params: { id: req.query.id },
        })
        .then(function(userdata) {
            res.render("update-user", { user: userdata.data });
        })
        .catch((err) => {
            res.send(err);
        });
};

exports.about = (req, res) => {
    res.render("About").catch((err) => {
        res.send(err);
    });
};