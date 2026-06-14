export function copyToClipboard(text, onSuccess) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      if (onSuccess) onSuccess();
    });
  } else {
    // Fallback for insecure contexts
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Fallback: Could not copy text", err);
    }
    document.body.removeChild(textArea);
  }
}
