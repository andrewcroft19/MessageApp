const messageHandler = require("../../src/messageHandling/MessageHandler");
const palindromes = ["racecar", "madam", "level", "rotor", "civic", "121", "11"];
const nonPalindromes = ["hello", "world", "javascript", "node", "express", "43", "", "1", "12"];

test.each(palindromes)("'%s' should be a palindrome", (word) => {
  expect(messageHandler.isPalindrome(word)).toBe(true);
});

test.each(nonPalindromes)("'%s' should NOT be a palindrome", (word) => {
  expect(messageHandler.isPalindrome(word)).toBe(false);
});
