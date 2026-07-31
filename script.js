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
const overflowPanel = document.getElementById("overflowPanel");
const safePreview = document.getElementById("safePreview");
const clearButton = document.getElementById("clearButton");
const copyButton = document.getElementById("copyButton");
const toast = document.getElementById("toast");

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
    overflowPanel.classList.add("hidden");
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
    overflowPanel.classList.add("hidden");
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
    overflowPanel.classList.add("hidden");
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

  safePreview.textContent = [...text].slice(0, LIMIT).join("");
  overflowPanel.classList.remove("hidden");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

clearButton.addEventListener("click", () => {
  orderText.value = "";
  updateCounter();
  orderText.focus();
});

copyButton.addEventListener("click", async () => {
  const safeText = [...orderText.value].slice(0, LIMIT).join("");

  try {
    await navigator.clipboard.writeText(safeText);
    showToast("First 60 characters copied");
  } catch {
    const helper = document.createElement("textarea");
    helper.value = safeText;
    helper.setAttribute("readonly", "");
    helper.style.position = "absolute";
    helper.style.left = "-9999px";
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
    showToast("First 60 characters copied");
  }
});

orderText.addEventListener("input", updateCounter);

updateCounter();
