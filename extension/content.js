console.log("Prompt Quality Evaluator loaded");

// -------------------------------
// 1. Find the ChatGPT prompt box
// -------------------------------
function getPromptBox() {
  return document.querySelector('[contenteditable="true"]');
}

// -------------------------------
// 2. State variables
// -------------------------------
let debounceTimer = null;
let lastPrompt = "";
let badgeElement = null;

// ON / OFF toggle state
let isEnabled = localStorage.getItem("pq_enabled") !== "false";

// -------------------------------
// 3. Utility helpers
// -------------------------------
function getColorByLabel(label) {
  switch (label) {
    case "Excellent":
      return "rgba(46, 204, 113, 0.85)"; // green
    case "Good":
      return "rgba(52, 152, 219, 0.85)"; // blue
    case "Fair":
      return "rgba(243, 156, 18, 0.85)"; // orange
    default:
      return "rgba(231, 76, 60, 0.85)";  // red
  }
}


// -------------------------------
// 4. Create / Update Badge UI
// -------------------------------
function createOrUpdateBadge(result) {
  if (!isEnabled) return;

  const inputBox = getPromptBox();
  if (!inputBox) return;

  // Attach OUTSIDE the textbox
  const wrapper =
    inputBox.closest("form") || inputBox.parentElement.parentElement;
  wrapper.style.position = "relative";

  // -----------------------------
  // Create badge (once)
  // -----------------------------
  if (!badgeElement) {
    badgeElement = document.createElement("div");

    // Typography
    badgeElement.style.fontFamily =
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    badgeElement.style.fontWeight = "500";
    badgeElement.style.fontSize = "12.5px";
    badgeElement.style.letterSpacing = "0.2px";
    badgeElement.style.whiteSpace = "nowrap";

    // Position: outside, bottom-right of textbox
    badgeElement.style.position = "absolute";
    badgeElement.style.right = "4%";
    badgeElement.style.top = "100%";
    badgeElement.style.marginTop = "6px";

    // Capsule style
    badgeElement.style.padding = "6px 14px";
    badgeElement.style.borderRadius = "9999px";
    badgeElement.style.color = "#fff";
    badgeElement.style.zIndex = "9999";
    badgeElement.style.cursor = "pointer";
    badgeElement.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";

    // Animation setup
    badgeElement.style.opacity = "0";
    badgeElement.style.transform = "scale(0.95)";
    badgeElement.style.transition =
      "opacity 0.25s ease, transform 0.25s ease";

    wrapper.appendChild(badgeElement);

    // -----------------------------
    // Create tooltip (once)
    // -----------------------------
    tooltipElement = document.createElement("div");
    tooltipElement.style.position = "absolute";
    tooltipElement.style.right = "0";

    tooltipElement.style.maxWidth = "260px";
    tooltipElement.style.padding = "8px 10px";
    tooltipElement.style.borderRadius = "8px";
    tooltipElement.style.background = "rgba(69, 62, 62, 0.85)";
    tooltipElement.style.color = "#fff";
    tooltipElement.style.fontSize = "12px";
    tooltipElement.style.fontStyle = "italic";
    tooltipElement.style.lineHeight = "1.4";
    tooltipElement.style.boxShadow = "0 6px 18px rgba(0,0,0,0.25)";
    tooltipElement.style.zIndex = "10000";
    tooltipElement.style.display = "none";
    tooltipElement.style.whiteSpace = "normal";

    wrapper.appendChild(tooltipElement);

    // Toggle tooltip on badge click
    badgeElement.addEventListener("click", (e) => {
      e.stopPropagation();

      const isVisible = tooltipElement.style.display === "block";
      tooltipElement.style.display = isVisible ? "none" : "block";

      // Re-position tooltip when showing
      if (!isVisible) {
        requestAnimationFrame(() => {
          const badgeHeight = badgeElement.offsetHeight;
          tooltipElement.style.top = `${badgeHeight + 8}px`;
        });
      }
    });




    // Hide tooltip when clicking elsewhere
    document.addEventListener("click", () => {
      tooltipElement.style.display = "none";
    });
  }

  // -----------------------------
  // Update content
  // -----------------------------
  badgeElement.style.backgroundColor = getColorByLabel(result.label);
  badgeElement.textContent = `Quality: ${result.label} (${result.score}/10)`;
  badgeElement.style.display = "block";

  if (tooltipElement) {
    tooltipElement.textContent = result.suggestion;
  }

  // ✅ POSITION TOOLTIP BELOW THE BADGE (ADD HERE)
  if (tooltipElement) {
    requestAnimationFrame(() => {
      const badgeHeight = badgeElement.offsetHeight;
      tooltipElement.style.top = `${badgeHeight + 8}px`;
    });
  }

  // -----------------------------
  // POP animation on every update
  // -----------------------------
  badgeElement.style.opacity = "0";
  badgeElement.style.transform = "scale(0.95)";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      badgeElement.style.opacity = "0.95";
      badgeElement.style.transform = "scale(1.03)";
    });
  });

  setTimeout(() => {
    badgeElement.style.transform = "scale(1)";
  }, 120);
}


// -------------------------------
// 5. Call your deployed API
// -------------------------------
async function evaluatePrompt(promptText) {
  if (!isEnabled) return;

  try {
    const response = await fetch(
      "https://question-quality-evaluator.onrender.com/evaluate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: promptText })
      }
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    console.log("Prompt Evaluation Result:", data);

    createOrUpdateBadge(data);

  } catch (error) {
    console.error("Prompt evaluation error:", error);
  }
}

// -------------------------------
// 6. Attach input listener
// -------------------------------
function attachListener() {
  const inputBox = getPromptBox();
  if (!inputBox) return;

  console.log("Prompt box detected!");

  inputBox.addEventListener("input", () => {
    if (!isEnabled) return;

    const currentText = inputBox.innerText.trim();

    // Hide badge if text too short
    if (currentText.length < 5) {
      if (badgeElement) badgeElement.style.display = "none";
      return;
    }

    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      if (currentText === lastPrompt) return;

      lastPrompt = currentText;
      console.log("Final prompt:", currentText);

      evaluatePrompt(currentText);

    }, 1000); // 1 second debounce
  });
}

// -------------------------------
// 7. Keyboard Toggle (Ctrl + Q)
// -------------------------------
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "q") {
    isEnabled = !isEnabled;
    localStorage.setItem("pq_enabled", isEnabled);
    console.log("Prompt Evaluator:", isEnabled ? "ON" : "OFF");

    if (!isEnabled && badgeElement) {
      badgeElement.style.display = "none";
    }
  }
});

// -------------------------------
// 8. Wait for ChatGPT to load
// -------------------------------
const interval = setInterval(() => {
  const box = getPromptBox();
  if (box) {
    clearInterval(interval);
    attachListener();
  }
}, 1000);

