// ===== config =====
function cfg() {
  return window.MYJLPT_CONFIG;
}

// ===== Cognito endpoint =====
function cognitoEndpoint() {
  return `https://cognito-idp.${cfg().REGION}.amazonaws.com/`;
}

// ===== common POST =====
async function cognitoPost(target, body) {
  const res = await fetch(cognitoEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": target
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Cognito error");
  }
  return data;
}

// ===== Register (full profile) =====
window.signUp = async function ({
  email,
  password,
  familyName,
  givenName,
  birthdate,
  gender
}) {
  const attrs = [{ Name: "email", Value: email }];

  if (familyName)
    attrs.push({ Name: "family_name", Value: familyName });

  if (givenName)
    attrs.push({ Name: "given_name", Value: givenName });

  if (birthdate)
    attrs.push({ Name: "birthdate", Value: birthdate });

  if (gender)
    attrs.push({ Name: "gender", Value: gender });

  return cognitoPost(
    "AWSCognitoIdentityProviderService.SignUp",
    {
      ClientId: cfg().CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: attrs
    }
  );
};
