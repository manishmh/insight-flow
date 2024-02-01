import { Resend } from 'resend';

const domain = process.env.NEXT_PUBLIC_APP_URL

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string,
) => {
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "2FA Code",
        html: `<p>Your 2FA Code is ${token}</p>`
    })
}

export const sendPasswordResetEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `${domain}/auth/new-password?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset Your Password",
        html: `<p>Click <a href="${confirmLink}"> here</a> to reset your password.</p>`,
    })
}

export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email",
        html: `<p>Click <a href="${confirmLink}"> here</a> to confirm your email.</p>`,
    })
}