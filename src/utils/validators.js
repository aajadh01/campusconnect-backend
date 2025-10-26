// src/utils/validators.js
// Role-aware validation for registeredId formats

function isValidRegisteredIdForRole(role, registeredId) {
  if (!role || !registeredId) return false
  const value = String(registeredId).trim()

  // Student format: 2 digits + 1 letter + 2 digits + 1 letter + 4 digits (e.g., 23L31A0501)
  // const studentPattern = /^[0-9]{2}[A-Z]{1}[0-9]{2}[A-Z]{1}[0-9]{4}$/i

  // Staff format (faculty, organizer, admin): 5 digits (e.g., 11831)
  const staffPattern = /^[0-9]{5}$/

  const normalizedRole = String(role).toLowerCase()
  if (normalizedRole === "student") {
    return value
  }
  // faculty, organizer, admin fall back to staff pattern
  return staffPattern.test(value)
}

module.exports = {
  isValidRegisteredIdForRole,
}
