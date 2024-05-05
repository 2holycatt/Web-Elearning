document.querySelectorAll("textarea").forEach(textarea => {
    textarea.addEventListener("input", autoResizeTextarea);
});

function autoResizeTextarea() {
    const textarea = this;
    // ปรับขนาดความสูงของ textarea ให้เท่ากับความสูงของเนื้อหาที่กรอกลงไป
    textarea.style.height = "auto";
    textarea.style.height = (textarea.scrollHeight) + "px";
}



