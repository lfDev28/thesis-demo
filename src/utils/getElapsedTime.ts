export default function getElapsedTime(date: number | undefined): string {
    if (!date) return 'No recent calibration found';
  
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
  
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
  
    if (hours > 0) {
      return `${hours} hours ago`;
    } else if (hours === 0 && minutes === 0) {
      return 'just now';
    } else {
      return `${minutes} minutes ago`;
    }
  }