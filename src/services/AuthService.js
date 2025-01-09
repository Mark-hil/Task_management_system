import { CognitoUserPool, CognitoUser, CognitoUserAttribute, AuthenticationDetails } from 'amazon-cognito-identity-js';
import CryptoJS from 'crypto-js';
import {jwtDecode} from 'jwt-decode';


// Pool data (ensure you replace this with your actual values)
const poolData = {
    UserPoolId: "eu-west-1_Im3Zlyu5u", // Replace with your User Pool ID
    ClientId: "38q9g206qfq9stfbl22cb31uab", // Replace with your App Client ID
    ClientSecret: "8n1s58am3i8tfa5cnar7o4t50ekp1cnst71elk8nmltapjdr81t" // Replace with your App Client Secret
};

const userPool = new CognitoUserPool(poolData);

// Function to generate the SECRET_HASH
const generateSecretHash = (username) => {
    try {
        const message = username + poolData.ClientId;
        const hash = CryptoJS.HmacSHA256(message, poolData.ClientSecret);
        return hash.toString(CryptoJS.enc.Base64);
    } catch (error) {
        console.error("Error generating SecretHash:", error);
        return null;
    }
};

// Sign-up function
export const signUp = async (username, password, email, role, group = null) => {
    const apiUrl = 'https://hrw00hg1tf.execute-api.eu-west-1.amazonaws.com/dev/registration'; // Replace with your API Gateway URL

    const payload = {
        username,
        password,
        email,
        role,
        group,
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
    }

    return await response.json();
};


// Confirm sign-up function  hhttps://hrw00hg1tf.execute-api.eu-west-1.amazonaws.com/dev/registration/confirmSignUp
export const confirmSignUp = async (username, confirmationCode) => {
    const apiUrl = 'https://hrw00hg1tf.execute-api.eu-west-1.amazonaws.com/dev/registration/confirmSignUp'; // Replace with your API Gateway URL

    const payload = {
        username,
        confirmationCode,
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to confirm sign-up');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in confirmSignUp:', error.message);
        throw error; // Re-throw the error to the calling function
    }
};





// Authenticate user function (Login)
export const authenticateUser = async (username, password) => {
    const secretHash = generateSecretHash(username);

    if (!secretHash) {
        console.error("SecretHash generation failed");
        throw new Error("Failed to generate SecretHash");
    }

    const payload = {
        username,
        password,
        secretHash,
    };

    const apiUrl = 'https://hrw00hg1tf.execute-api.eu-west-1.amazonaws.com/dev/registration/login'; 

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const responseData = await response.json();
        console.log('API Response:', responseData); // Debug response

        if (!response.ok) {
            console.error('API Error:', responseData);
            throw new Error(responseData.error || 'Authentication failed');
        }

        return responseData; // Ensure this includes accessToken and idToken
    } catch (err) {
        console.error('Authentication error:', err);
        throw err;
    }
};


export const getUserRole = (idToken) => {
    return new Promise((resolve, reject) => {
        try {
            // Decode the ID Token to extract claims (optional if you still want to inspect the token)
            const decodedToken = jwtDecode(idToken);
            console.log('Decoded Token:', decodedToken); // Log the decoded token for inspection
            
            // Now, get the role from the response body (assuming it is passed from your API)
            const role = decodedToken['role'];  // role should be part of the API response, not the ID token.

            if (role) {
                resolve(role);  // Return the role if found
            } else {
                reject('Role not found in the response');
            }
        } catch (error) {
            reject('Failed to decode token or retrieve role: ' + error.message || error);
        }
    });
};





// Forgot password function
export const forgotPassword = (username) => {
    const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool
    });

    return new Promise((resolve, reject) => {
        cognitoUser.forgotPassword({
            onSuccess: (result) => {
                resolve(result);
            },
            onFailure: (err) => {
                reject(err);
            }
        });
    });
};

// Reset password function
export const resetPassword = (username, verificationCode, newPassword) => {
    const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool
    });

    return new Promise((resolve, reject) => {
        cognitoUser.confirmPassword(verificationCode, newPassword, {
            onSuccess: () => {
                resolve("Password reset successful");
            },
            onFailure: (err) => {
                reject(err);
            }
        });
    });
};

// Get user attributes function
export const getUserAttributes = (username) => {
    const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool
    });

    return new Promise((resolve, reject) => {
        cognitoUser.getUserData((err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
