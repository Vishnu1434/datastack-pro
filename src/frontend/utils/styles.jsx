import * as constants from "../resources/constants.jsx";

export const measureAndSetWidth = (key, options, setButtonWidths, { includeCheckbox = false, buttonLabel = "" } = {}) => {
    if (!options?.length) return;
    let maxWidth = 0;

    const container = document.createElement("div");
    container.style.cssText = "visibility:hidden;position:absolute;left:-9999px;top:-9999px;";
    document.body.appendChild(container);

    const menu = document.createElement("div");
    menu.style.maxHeight = "240px";
    menu.style.overflow = "auto";
    container.appendChild(menu);

    const createEl = (text) => {
        const el = document.createElement(includeCheckbox ? "label" : "div");
        el.className = "px-3 py-2 text-sm flex items-center";
        if (includeCheckbox) {
            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.className = "mr-2";
            el.appendChild(cb);
        }
        const span = document.createElement("span");
        span.textContent = text;
        el.appendChild(span);
        menu.appendChild(el);
        return el.offsetWidth;
    };

    options.forEach((opt) => {
        maxWidth = Math.max(maxWidth, createEl(opt));
    });

    if (buttonLabel) {
        const btn = document.createElement("button");
        btn.className = constants.BUTTON_CLASSES;
        btn.textContent = buttonLabel;
        container.appendChild(btn);
        maxWidth = Math.max(maxWidth, btn.offsetWidth);
    }

    // account for scrollbar if present
    if (menu.scrollHeight > menu.clientHeight) {
        maxWidth += menu.offsetWidth - menu.clientWidth;
    }

    document.body.removeChild(container);
    setButtonWidths((prev) => ({ ...prev, [key]: maxWidth + 12 }));
};

export const computeDropdownPosition = (key, dropdownRefs, buttonWidths) => {
    const btn = dropdownRefs.current[key];
    const w = buttonWidths[key];
    if (!btn || !w) return {};
    const rect = btn.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const spaceRight = viewportWidth - rect.left - 8;
    return w <= spaceRight ? { left: 0 } : { left: "auto", right: 0 };
};