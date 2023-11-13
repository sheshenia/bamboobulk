export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const addZero = (i) => i < 10 ? "0" + i : i