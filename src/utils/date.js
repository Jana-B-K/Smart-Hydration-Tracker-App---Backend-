const getStartDay = (date = new Date()) => {
    const d = new Date(date);
    d.setUTCHours(0,0,0,0);
    return d;
}
export default getStartDay;