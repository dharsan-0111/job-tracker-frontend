import { triggerApi } from "../helpers/triggerApi";

export const sendJobDetailsForParsing = (data: any) =>
{
    console.log("inside send job details api function")
    const API_URL = `${import.meta.env.VITE_API_DOMAIN}/jobs`;
    return triggerApi(API_URL, 'POST', data);
}
