const externalMessageErrorParts = [
  "A listener indicated an asynchronous response by returning true",
  "the message channel closed before a response was received",
];

const getErrorText = (reason: unknown) => {
  if (reason instanceof Error) return reason.message;
  if (typeof reason === "string") return reason;
  if (reason && typeof reason === "object" && "message" in reason) return String(reason.message);
  return "";
};

const isExternalMessageError = (reason: unknown) => {
  const message = getErrorText(reason);
  return externalMessageErrorParts.every(part => message.includes(part));
};

export const installExternalMessageErrorFilter = () => {
  if (typeof window === "undefined") return;

  window.addEventListener("unhandledrejection", event => {
    if (!isExternalMessageError(event.reason)) return;

    event.preventDefault();
  });
};
