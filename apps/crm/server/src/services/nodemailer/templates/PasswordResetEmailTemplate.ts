export const EMAIL_TEMPLATE_PASSWORD_RESET = `<!doctype html>
<html>
  <body>
    <div
      style="
        background-color: #f3f7fa;
        color: #464646;
        font-family: ui-rounded, 'Hiragino Maru Gothic ProN', Quicksand, Comfortaa, Manjari, 'Arial Rounded MT Bold',
          Calibri, source-sans-pro, sans-serif;
        font-size: 16px;
        font-weight: 400;
        letter-spacing: 0.15008px;
        line-height: 1.5;
        margin: 0;
        padding: 32px 0;
        min-height: 100%;
        width: 100%;
      ">
      <table
        align="center"
        width="100%"
        style="margin: 0 auto; max-width: 600px; background-color: #ffffff; border-radius: 4px"
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        border="0">
        <tbody>
          <tr style="width: 100%">
            <td>
              <h1
                style="
                  color: #ebebeb;
                  background-color: #d28adb;
                  font-weight: bold;
                  text-align: center;
                  margin: 0;
                  font-size: 32px;
                  padding: 16px 24px 16px 24px;
                ">
                TECHEXPO - CRM RESET PASSWORD
              </h1>
              <div style="color: #1a1a1a; font-weight: normal; text-align: center; padding: 16px 24px 16px 24px">
                A request was received to reset the password for the CRM account associated with {USER_EMAIL} - no
                changes have been made to your account yet.
              </div>
              <div style="font-weight: normal; text-align: center; padding: 16px 24px 16px 24px">
                To reset the password of the account click the button below.
              </div>
              <div style="text-align: center; padding: 0px 24px 0px 24px">
                <a
                  href={PASSWORD_RESET_URL}
                  style="
                    color: #ffffff;
                    font-size: 18px;
                    font-weight: bold;
                    background-color: #c995d0;
                    border-radius: 4px;
                    display: block;
                    padding: 12px 20px;
                    text-decoration: none;
                  "
                  target="_blank"
                  ><span
                    ><!--[if mso
                      ]><i style="letter-spacing: 20px; mso-font-width: -100%; mso-text-raise: 30" hidden>&nbsp;</i><!
                    [endif]--></span
                  ><span>Reset Password</span
                  ><span
                    ><!--[if mso
                      ]><i style="letter-spacing: 20px; mso-font-width: -100%" hidden>&nbsp;</i><!
                    [endif]--></span
                  ></a
                >
              </div>
              <div style="font-weight: normal; padding: 16px 24px 16px 24px">
                Alternatively you can copy-paste the following URL into your browser directly:
              </div>
              <div style="font-weight: normal; padding: 0px 24px 16px 24px">{PASSWORD_RESET_URL}</div>
              <div
                style="
                  color: #1a1a1a;
                  font-size: 16px;
                  font-weight: normal;
                  text-align: center;
                  padding: 16px 24px 16px 24px;
                ">
                The password reset is valid for 10 minutes.
              </div>
              <div style="padding: 4px 24px 4px 24px">
                <hr style="width: 100%; border: none; border-top: 1px solid #cccccc; margin: 0" />
              </div>
              <div
                style="
                  color: #868686;
                  font-size: 14px;
                  font-weight: normal;
                  text-align: center;
                  padding: 8px 24px 12px 24px;
                ">
                If you did not request a new password, please let us know immediately by contacting ADMIN@EMAIL.COM
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>
`;
