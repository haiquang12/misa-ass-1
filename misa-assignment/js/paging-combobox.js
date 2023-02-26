// bắt sự kiện phân trang 
var selectedField = document.getElementById("selectedField");
var selectedText = document.getElementById("selectedText");
var option = document.getElementsByClassName("option-paging");
var list = document.getElementById("list-option-paging");
var arrowIcon = document.getElementById("arrowIcon-paging");

arrowIcon.onclick = function () {
    list.classList.toggle("hidden");
    arrowIcon.classList.toggle("rotate");
}
for (const opt of option) {
    opt.onclick = function () {
        selectedText.innerHTML = this.textContent;
        list.classList.toggle("hidden");
        arrowIcon.classList.toggle("rotate");
    }
}

// bắt sự kiện tabindex của form nhân viên
$(".last-focus").on("blur", function () {
    document.querySelector("#frmDetail .popup-employee .default-focus").focus();
})





