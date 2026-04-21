import Constants from "expo-constants";

const getBaseUrl = () => {
    const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
    if (configuredUrl) {
        return configuredUrl.replace(/\/$/, "");
    }

    const hostUri = Constants.expoConfig?.hostUri;
    const host = hostUri?.split(":")[0];

    if (host) {
        return `http://${host}:5000`;
    }

    return "http://localhost:5000";
};

export const BASE_URL = getBaseUrl();