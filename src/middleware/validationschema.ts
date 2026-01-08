export const userValidationSchema = {
    firstName: {
        trim: true,
        isString: {
            errorMessage: "First name must be a string"
        },
        notEmpty: {
            errorMessage: "First name cannot be empty"
        }
    },

    lastName: {
        trim: true,
        isString: {
            errorMessage: "Last name must be a string"
        },
        notEmpty: {
            errorMessage: "Last name cannot be empty"
        }
    },

    email: {
        trim: true,
        isEmail: {
            errorMessage: "Must be a valid email"
        },
        notEmpty: {
            errorMessage: "Email cannot be empty"
        }
    },

    password: {
        trim: true,
        isString: {
            errorMessage: "Password must be a string"
        },
        notEmpty: {
            errorMessage: "Password cannot be empty"
        },
        isLength: {
            options: { min: 5 },
            errorMessage: "Password must be at least 5 characters" // Fixed typo: errormessage -> errorMessage
        }
    }
};