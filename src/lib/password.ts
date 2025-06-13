import bcrypt from 'bcryptjs';
export async function saltAndHashPassword(plainPassword:string) {
    const hashedPassword = bcrypt.hash(plainPassword, 12);

    return hashedPassword;
    
}
export async function comparePassword(plainPassword:string, hashedPassword:string) {
    const isPasswordCorrect = await bcrypt.compare(plainPassword, hashedPassword)
    
    return isPasswordCorrect;

}