export const getDate = () => {
    const now = new Date();
    const options = {
        day: "numeric",
        month: "long",
    };
    return now.toLocaleDateString("en-US", options);
};
export const getDay = () => {
    const now = new Date();
    const options = {
        weekday: "long",
    };
    return now.toLocaleDateString("en-US", options);
};
