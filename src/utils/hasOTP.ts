import bcrypt from "bcryptjs";

// generate otp
const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}
const hashOtp = (otp: string | number) => {
    const hashedOtp = bcrypt.hashSync(String(otp), 10);
    return hashedOtp;
}

const compareOtp = (otp: string | number, hashedOtp: string) => {
    const isMatch = bcrypt.compareSync(String(otp), hashedOtp);
    return isMatch;
}


export { hashOtp, compareOtp, generateOTP }