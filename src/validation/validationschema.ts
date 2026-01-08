export const userValidationShema = {
    firstName: {
        trim: true,
        isString: true,
        notEmpty: { errorMessage: "firstname cannot be empty" }
    },

    lastName: {
        trim: true,
        isString: true,
        notEmpty: { errorMessage: "lastname cannot be empty" }
    },

    email: {
        trim: true,
        isEmail: true,
        notEmpty: { errorMessage: "email cannot be empty" }
    },

    password: {
        trim: true,
        isString: true,
        isLength: {
            options: { min: 5 },
            errormessage: "password must be at least 5 characters"
        }
    }
}


