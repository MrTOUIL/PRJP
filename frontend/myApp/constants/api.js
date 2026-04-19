import Constants from "expo-constants" ; 

const getBaseUrl = () => {
    const host = Constants.expoConfig?.hostUri?.split(':')[0] ;
    return `http://${host}:5000` ; 
}

export const BASE_URL = getBaseUrl() ; 