const signUpErrors = (err) => {
    let errors = { pseudo: "", email: "", password: "" };

    if (err.message.includes("pseudo"))
        errors.pseudo = "Incorrect pseudo or pseudo already taken ";

    if (err.message.includes("email")) errors.email = "Incorrect email";

    if (err.message.includes("password"))
        errors.password = "Password must be at least 6 characters long";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
        errors.pseudo = "Pseudo taken";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
        errors.email = "Email already in use";

    return errors;
};

const signInErrors = (err) => {
    let errors = { email: '', password: '' }

    if (err.message.includes("email"))
        errors.email = "Email unknown";

    if (err.message.includes('password'))
        errors.password = "Incorrect password"

    return errors;
}


module.exports = {
    signUpErrors,
    signInErrors,
}