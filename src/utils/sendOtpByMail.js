import { sendMail } from "./SendMail.js"

const sendOtpByMail = async (otp, email) => {
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SnapStore - Reset Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            background-color: #0077cc;
            padding: 20px 0;
            border-radius: 8px 8px 0 0;
        }

        .header h1 {
            color: #ffffff;
            margin: 0;
        }

        .content {
            padding: 20px;
        }

        .content h2 {
            font-size: 20px;
            color: #333;
        }

        .content p {
            font-size: 16px;
            color: #555;
            line-height: 1.5;
        }

        .otp-code {
            display: inline-block;
            padding: 15px 25px;
            background-color: #0077cc;
            color: #ffffff;
            font-size: 24px;
            letter-spacing: 3px;
            font-weight: bold;
            text-align: center;
            border-radius: 4px;
            margin: 20px 0;
        }

        .footer {
            text-align: center;
            font-size: 14px;
            color: #888;
            padding: 20px 0;
            background-color: #f4f4f4;
            border-radius: 0 0 8px 8px;
        }

        .footer a {
            color: #0077cc;
            text-decoration: none;
        }
    </style>
</head>

<body>

    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>SnapStore</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hi there,</p>
            <p>You recently requested to reset your password for your SnapStore account. Use the OTP code below to reset it. This OTP is valid for the next 10 minutes.</p>

            <!-- OTP Code -->
            <div class="otp-code">${otp}</div>

            <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
            <p>Thanks,<br>The SnapStore Team</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Need help? <a href="mailto:support@snapstore.com">Contact us</a></p>
            <p>© 2024 SnapStore, All Rights Reserved.</p>
        </div>
    </div>

</body>

</html>`

    const response = await sendMail(email, 'SnapStore forgot password', htmlTemplate);
    return response
}

export {
    sendOtpByMail
}