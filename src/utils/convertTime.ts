export function convertTime(time) {
    if (time < 10) {
        return "0" + time;
    }
    return time;
}