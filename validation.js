const Validator = require("fastest-validator");

const checkRegister = (data) => {
    const v = new Validator();

    const schema = {
        name: {
            type: "string",
            required: true,
            max: 256,
        },
        email: {
            type: "string",
            required: true,
            max: 256,
        },
        password: {
            type: "string",
            required: true,
            max: 1024,
            min: 6,
        },
    };

    const check = v.compile(schema);

    return check(data);
};
const checkLogin = (data) => {
    const v = new Validator();

    const schema = {
        email: {
            type: "string",
            required: true,
            max: 256,
        },
        password: {
            type: "string",
            required: true,
            max: 1024,
            min: 6,
        },
    };

    const check = v.compile(schema);

    return check(data);
};

module.exports = { checkRegister, checkLogin };