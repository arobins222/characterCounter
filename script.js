const LIMIT = 60;

const orderText = document.getElementById("orderText");
const characterCount = document.getElementById("characterCount");
const remainingCount = document.getElementById("remainingCount");
const wordCount = document.getElementById("wordCount");
const progressBar = document.getElementById("progressBar");
const statusPanel = document.getElementById("statusPanel");
const statusIcon = document.getElementById("statusIcon");
const statusTitle = document.getElementById("statusTitle");
const statusMessage = document.getElementById("statusMessage");
const clearButton = document.getElementById("clearButton");

function getWordCount(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function setStatus(type, icon, title, message) {
  statusPanel.className = `status-panel ${type}`;
  statusIcon.textContent = icon;
  statusTitle.textContent = title;
  statusMessage.textContent = message;
}

function updateCounter() {
  const text = orderText.value;
  const count = [...text].length;
  const remaining = LIMIT - count;
  const percentage = Math.min((count / LIMIT) * 100, 100);

  characterCount.textContent = count;
  remainingCount.textContent = remaining;
  wordCount.textContent = getWordCount(text);
  progressBar.style.width = `${percentage}%`;

  if (count === 0) {
    progressBar.style.background = "linear-gradient(90deg, var(--blue), var(--cyan))";
    setStatus(
      "status-ready",
      "✓",
      "Ready for input",
      `The value must be ${LIMIT} characters or fewer.`
    );
    return;
  }

  if (count <= 45) {
    progressBar.style.background = "linear-gradient(90deg, var(--blue), var(--cyan))";
    setStatus(
      "status-good",
      "✓",
      "Within vendor limit",
      `${remaining} characters remain. This value is safe to submit.`
    );
    return;
  }

  if (count <= LIMIT) {
    progressBar.style.background = "linear-gradient(90deg, var(--amber), #ffd976)";
    setStatus(
      "status-warning",
      "!",
      "Approaching the limit",
      `${remaining} character${remaining === 1 ? "" : "s"} remain. Review before submitting.`
    );
    return;
  }

  const overBy = Math.abs(remaining);
  progressBar.style.background = "linear-gradient(90deg, var(--red), #ff8a96)";
  setStatus(
    "status-error",
    "×",
    "Vendor limit exceeded",
    `Remove ${overBy} character${overBy === 1 ? "" : "s"} before submitting this order.`
  );

}


clearButton.addEventListener("click", () => {
  orderText.value = "";
  updateCounter();
  orderText.focus();
});


orderText.addEventListener("input", updateCounter);

updateCounter();
