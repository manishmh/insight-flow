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

  const htmlContent = `
    <p> Click <a href="${confirmLink}" target="_blank">here</a> to reset your password. </p>
    <div>Or copy and paste the following link into your browser: ${confirmLink}</div>
  `;


  const options = {
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset Your Password",
    html: htmlContent,
  };

  try {
    const response = await resend.emails.send(options);
    console.log("Password reset email sent with link:", confirmLink);
    console.log("Email service response:", response); 
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};


export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email",
        html: `<p>Click <a href="${confirmLink}"> here </a> to confirm your email.</p>`,
    })
}