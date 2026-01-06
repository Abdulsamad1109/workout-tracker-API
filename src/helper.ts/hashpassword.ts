import * as bcrypt from 'bcrypt'

export const hashpassword = (password: string) => {
    // Generate salt
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
}

export const comparePassword = (plain: string, hashed: string) =>{
    return bcrypt.compareSync(plain, hashed)
}