export async function countdown(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    const countdownInterval = setInterval(() => {
      showCountdown(seconds);
      seconds--;
      if (seconds < 0) {
        $("#countdown").remove();
        clearInterval(countdownInterval);
        resolve();
      }
    }, 1000);
  });
}

function showCountdown(number: number): void {
  let countdownElement = $("#countdown");
  if (countdownElement.length === 0) {
    countdownElement = $("<div>").attr("id", "countdown").appendTo("body");
  }
  countdownElement.text(number);
  countdownElement.css({
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 9999,
    fontSize: "48px",
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "20px",
    borderRadius: "10px",
  });
}
