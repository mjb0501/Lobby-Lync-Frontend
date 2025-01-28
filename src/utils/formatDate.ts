

export function formatDate(dateString: string) {
    const currentDate = new Date();
    const inputDate = new Date(dateString);

    const timeDifference = currentDate.getTime() - inputDate.getTime();
    const secondsDifference = timeDifference / 1000;

    if (secondsDifference < 60) {
        return `${Math.floor(secondsDifference)} seconds ago`;
    } else {
        const minutes = Math.floor(secondsDifference / 60);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
}