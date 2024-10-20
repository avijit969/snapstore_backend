import bcrypt from "bcryptjs";

// generate otp
const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
}
const hashOtp = (otp) => {
    const hashedOtp = bcrypt.hashSync(otp, 10);
    return hashedOtp;
}

const compareOtp = (otp, hashedOtp) => {
    const isMatch = bcrypt.compareSync(otp, hashedOtp);
    return isMatch;
}


export { hashOtp, compareOtp, generateOTP }