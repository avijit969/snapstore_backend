import { Resend } from "resend"
const resend = new Resend(process.env.RESEND_API_KEY)
const sendMail = async (to, subject, html) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "SnapStore 📸 <snaptore@aviscodeverse.tech>",
            to,
            subject,
            html
        })
        if (error) {
            return {
                success: false,
                message: error.message
            }
        }
        if (data) {
            return {
                success: true,
                message: "mail send successfully"
            }
        }
    } catch (error) {
        console.log(error)
    }
}

export {
    sendMail
}