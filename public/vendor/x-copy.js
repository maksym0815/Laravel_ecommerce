let onCopy = () => {};
const copy = (target) => {
    if (typeof target === "function") {
        target = target();
    }

    if (typeof target === "object") {
        target = JSON.stringify(target);
    }

    return window.navigator.clipboard.writeText(target).then(onCopy);
};

function Clipboard(Alpine) {
    Alpine.magic("clipboard", () => {
        return copy;
    });

    Alpine.directive(
        "clipboard",
        (el, { modifiers, expression }, { evaluateLater, cleanup }) => {
            const getCopyContent = modifiers.includes("raw")
                ? (c) => c(expression)
                : evaluateLater(expression);
            const clickHandler = () => getCopyContent(copy);
            el.addEventListener("click", clickHandler);
            cleanup(() => el.removeEventListener("click", clickHandler));
        }
    );
}

Clipboard.configure = (config) => {
    if (
        config.hasOwnProperty("onCopy") &&
        typeof config.onCopy === "function"
    ) {
        onCopy = config.onCopy;
    }

    return Clipboard;
};

document.addEventListener("alpine:initializing", () =>
    Clipboard(window.Alpine)
);
