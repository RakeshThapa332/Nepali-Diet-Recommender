/**
 * Calculate age in whole years from a date of birth string (YYYY-MM-DD).
 * Returns 0 if the date is empty or invalid.
 */
export function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;

  const dob = new Date(dateOfBirth);

  if (isNaN(dob.getTime())) return 0;

  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() &&
      today.getDate() >= dob.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return Math.max(age, 0);
}