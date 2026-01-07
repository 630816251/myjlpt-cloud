// =====================
// ===== config =====
// =====================
function cfg() {
  return window.MYJLPT_CONFIG;
}

// =====================
// ===== Cognito endpoint =====
// =====================
function cognitoEndpoint() {
  return `https://cognito-idp.${cfg().REGION}.amazonaws.com/`;
}

// =====================
// ===== common Cognito POST =====
// =====================
async function cognitoPost(target, body) {
  const res = await fetch(cognitoEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": target
    },
    body: JSON.stringify(body)
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error((data && data.message) || "Cognito error");
  }

  return data;
}

// =====================
// ===== Register（呼叫 Lambda）=====
// =====================
window.signUp = async function ({
  email,
  familyName,
  givenName,
  birthdate,
  gender
}) {
  const res = await fetch(
    `${cfg().API_BASE}/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        familyName,
        givenName,
        birthdate,
        gender
      })
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Register failed");
  }

  return data;
};

// =====================
// ===== Login（支援首次登入）=====
// =====================
window.login = async function (email, password) {
  const data = await cognitoPost(
    "AWSCognitoIdentityProviderService.InitiateAuth",
    {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: cfg().CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    }
  );

  // 🔐 第一次登入 → 強制設定新密碼
  if (data.ChallengeName === "NEW_PASSWORD_REQUIRED") {
    return {
      challenge: "NEW_PASSWORD_REQUIRED",
      session: data.Session,
      email
    };
  }

  // ✅ 正常登入成功
  const r = data.AuthenticationResult;
  localStorage.setItem("idToken", r.IdToken);
  localStorage.setItem("accessToken", r.AccessToken);
  localStorage.setItem("refreshToken", r.RefreshToken);

  return { challenge: null };
};

// =====================
// ===== Complete New Password =====
// =====================
window.completeNewPassword = async function (
  email,
  newPassword,
  session
) {
  const data = await cognitoPost(
    "AWSCognitoIdentityProviderService.RespondToAuthChallenge",
    {
      ClientId: cfg().CLIENT_ID,
      ChallengeName: "NEW_PASSWORD_REQUIRED",
      Session: session,
      ChallengeResponses: {
        USERNAME: email,
        NEW_PASSWORD: newPassword
      }
    }
  );

  const r = data.AuthenticationResult;
  localStorage.setItem("idToken", r.IdToken);
  localStorage.setItem("accessToken", r.AccessToken);
  localStorage.setItem("refreshToken", r.RefreshToken);

  // ✅ 完成後清除改密碼狀態
  sessionStorage.removeItem("NEW_PW_SESSION");
  sessionStorage.removeItem("NEW_PW_EMAIL");
};

// =====================
// ===== Forgot Password =====
// =====================
window.forgotPassword = async function (email) {
  return cognitoPost(
    "AWSCognitoIdentityProviderService.ForgotPassword",
    {
      ClientId: cfg().CLIENT_ID,
      Username: email
    }
  );
};

// =====================
// ===== Reset Password =====
// =====================
window.confirmForgotPassword = async function (
  email,
  code,
  newPassword
) {
  return cognitoPost(
    "AWSCognitoIdentityProviderService.ConfirmForgotPassword",
    {
      ClientId: cfg().CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword
    }
  );
};

// =====================
// ===== Change Password =====
// =====================
window.changePassword = async function (oldPassword, newPassword) {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("尚未登入");

  return cognitoPost(
    "AWSCognitoIdentityProviderService.ChangePassword",
    {
      AccessToken: accessToken,
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword
    }
  );
};

// =====================
// ===== Update Profile =====
// =====================
window.updateProfile = async function (attributes) {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("尚未登入");

  return cognitoPost(
    "AWSCognitoIdentityProviderService.UpdateUserAttributes",
    {
      AccessToken: accessToken,
      UserAttributes: attributes
    }
  );
};

// =====================
// ===== Delete Account =====
// =====================
window.deleteAccount = async function () {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("尚未登入");

  await cognitoPost(
    "AWSCognitoIdentityProviderService.DeleteUser",
    {
      AccessToken: accessToken
    }
  );
};

// =====================
// ===== Helpers =====
// =====================
function isInNewPasswordFlow() {
  return (
    !!sessionStorage.getItem("NEW_PW_SESSION") &&
    !!sessionStorage.getItem("NEW_PW_EMAIL")
  );
}

window.isLoggedIn = function () {
  // 已完成登入
  if (localStorage.getItem("idToken")) return true;

  // 🔐 正在強制改密碼流程中（允許）
  if (isInNewPasswordFlow()) return true;

  return false;
};

window.logout = function () {
  localStorage.removeItem("idToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "login.html";
};
