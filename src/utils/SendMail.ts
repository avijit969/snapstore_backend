import { Resend } from "resend"
const resend = new Resend("re_YLo3vq49_LE8JygYbdsFJsrj9aCyvEwio")

const sendMail = async (to: string, subject: string, html: string) => {
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
        return {
            success: false,
            message: "Internal server error in sending mail"
        }
    }
}

export {
    sendMail
}