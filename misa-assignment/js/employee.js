window.onload = function () {

    page = new EmployeePage();
}

class EmployeePage {
    Data;
    constructor() {
        this.loadData();
        this.intEvents();
    }

    /**
     * Load dữ liệu cho table
     */

    loadData() {
        // xóa dữ liệu cũ trong bảng
        $("table#tbEmployeeList tbody").empty();

        // hiển thị loading
        let tableLoading = document.querySelector(".table-loading");
        tableLoading.style.display = "block";

        try {

            //goi api thực hiện lấy dữ liệu
            fetch("https://apidemo.laptrinhweb.edu.vn/api/v1/Employees")
                .then(res => res.json())
                .then(data => {
                    this.Data = data;
                    //Build table
                    this.buildDataTable(data);
                })

            //build table
        } catch (error) {

        }
    }


    /**
     * Load dữ liệu cho table
     */
    buildDataTable(data) {
        try {


            let table = document.getElementById("tbEmployeeList");
            let bodyTable = table.lastElementChild;
            //tạo từng dòng dữ liệu tương ứng từng đối tượng trong danh sách nhân viên rồi đẩy lên table
            //1. duyệt từng đối tượng trong danh sách   
            for (const item of this.Data) {

                //2. lấy ra thông tin cần thiết
                const employeeCode = item.EmployeeCode;
                const fullName = item.FullName;
                const genderName = item.GenderName;
                const dob = item.DateOfBirth;
                const salary = item.Salary;
                const identityNumber = item.IdentityNumber;
                const positionName = item.PositionName;
                //3. Build HTML thể hiện các thông tin trên table
                let trElement = document.createElement("tr");

                //build checkbox
                let tdCheckbox = document.createElement("td");
                let formCheckbox = document.createElement("div");
                formCheckbox.classList.add("form-checkbox");
                let checkboxItem = document.createElement("label");
                checkboxItem.classList.add("checkbox-item");
                let inputCheckbox = document.createElement("input");
                inputCheckbox.classList.add("checkbox");
                inputCheckbox.setAttribute("type", "checkbox");
                inputCheckbox.setAttribute("name", "checkbox");
                let bgCheckbox = document.createElement("div");
                bgCheckbox.classList.add("bg-checkbox");
                checkboxItem.append(inputCheckbox);
                checkboxItem.append(bgCheckbox);
                formCheckbox.append(checkboxItem);
                tdCheckbox.append(formCheckbox);

                trElement.append(tdCheckbox);

                //build employeeCode
                trElement.append(this.buildTdElement(employeeCode));

                //build employeeName
                trElement.append(this.buildTdElement(fullName));

                //build employeeGender
                trElement.append(this.buildTdElement(genderName));

                //build employee date of birth
                trElement.append(this.buildTdElement(formatDate(dob), "text-center"));

                //build CMND
                trElement.append(this.buildTdElement(identityNumber));

                //build employee position
                trElement.append(this.buildTdElement(positionName));

                //build employee salary
                trElement.append(this.buildTdElement(formatMoney(salary), "text-right"));
                //build chuc nang
                let tdFunction = document.createElement("td");
                let action = document.createElement("div");
                action.classList.add("action");
                let actionText = document.createElement("span");
                actionText.classList.add("action-text");
                actionText.textContent = "Sửa";
                let actionOption = document.createElement("div");
                actionOption.classList.add("action-option");
                let iconAction = document.createElement("button");
                iconAction.classList.add("icon-action");
                let actionEmp = document.createElement("div");
                actionEmp.classList.add("action-emp");
                actionEmp.classList.add("hidden");
                let actionDouble = document.createElement("div");
                actionDouble.classList.add("action-general");
                actionDouble.textContent = "Nhân bản";
                let actionFix = document.createElement("div");
                actionFix.classList.add("action-general");
                actionFix.classList.add("action-fix");
                actionFix.textContent = "Sửa";
                let actionDelete = document.createElement("div");
                actionDelete.classList.add("action-general");
                actionDelete.textContent = "Xóa";
                actionEmp.append(actionDouble);
                actionEmp.append(actionFix);
                actionEmp.append(actionDelete);
                actionOption.append(iconAction);
                actionOption.append(actionEmp);
                action.append(actionText);
                action.append(actionOption);

                tdFunction.append(action);

                trElement.append(tdFunction);


                //4. Đẩy vào table
                bodyTable.append(trElement);

            }
            createEvents();

            // xóa loading
            let tableLoading = document.querySelector(".table-loading");
            tableLoading.style.display = "none";
        } catch (error) {
            console.log(error);
        }
    }

    // build xữ liệu td
    buildTdElement(textContent, textPosition) {
        let tdElement = document.createElement("td");
        try {
            tdElement.textContent = textContent;
            tdElement.classList.add(textPosition);
            return tdElement;
        } catch (error) {
            return tdElement;
        }
    }

    intEvents() {
        //load lại dữ liệu trong bảng
        $(".loading").click(function () {
            page.loadData();
        })
    }
}





function createEvents() {
    try {
        // mở form nhân viên
        document.getElementById("btnAddOnClick").addEventListener("click", openFormDetail);

        // đóng form nhân viên
        document.getElementById("onCloseForm").addEventListener("click", closeFormDetail);

        //validate empty
        document.querySelectorAll(".textNotEmpty").forEach(function (el) {
            el.addEventListener("blur", onValidateFieldEmpty);
        });

        // validate date
        document.querySelectorAll(".validate-date").forEach(function (el) {
            el.addEventListener("change", onValidateDate);
        });

        // validate number
        document.querySelectorAll(".validate-number").forEach(function (el) {
            el.addEventListener("blur", onValidateNumber);
        });

        // validate email
        document.querySelectorAll(".validate-email").forEach(function (el) {
            el.addEventListener("blur", onValidateEmail);
        });

        // check checkbox hàng loạt
        onCheckListAll();


        // đóng/mở context menu
        document.querySelectorAll(".icon-action").forEach(function (e) {
            e.addEventListener("focusout", closeContextMenu);
            e.addEventListener("click", openContextMenu);
        })

        // mở form sửa nhân viên 
        document.querySelectorAll(".action-emp .action-fix").forEach(function (e) {
            e.addEventListener("click", fixFormDetail);
        })

        // mở form sửa nhân viên bằng double click vào tr
        document.querySelectorAll(".tbody tr").forEach(function (e) {
            e.addEventListener("dblclick", fixFormDetail);
        })

        //mở form sửa nhân viên bằng Sửa
        document.querySelectorAll(".action-text").forEach(function (e) {
            e.addEventListener("click", fixFormDetail);
        })

        // document.querySelectorAll(".icon-action").forEach(function (e) {
        //     e.addEventListener("click", clickOutSideDropdown);
        // })

    } catch (error) {
        console.log(error);
    }
}
// function clickOutSideDropdown() {
//     let actionEmp = document.querySelector(".action-emp");
//     document.addEventListener("click", (e) => {
//         let input = e.target;
//         console.log(input);
//         do {
//             if (input == actionEmp) {
//                 return;
//             }
//             input = input.parentNode;
//         } while (input);
//             if (!actionEmp.classList.contains("hidden")) {
//                 actionEmp.classList.add("hidden");
//                 actionEmp.classList.remove("active");
//             }
        

//     })
// }

// hàm mở sửa form nhân viên
function fixFormDetail() {
    document.querySelector(".title").textContent = "Sửa nhân viên";
    document.getElementById("frmDetail").style.display = "block";

}


// hàm đóng/ mở context menu
function openContextMenu() {
    let menu = this.nextElementSibling;
    menu.classList.toggle("active");
    menu.classList.toggle("hidden");
}

// hàm đóng context menu
function closeContextMenu() {
    let menu = event.target.nextElementSibling;
    menu.classList.remove("active");
    menu.classList.add("hidden");
}

// hàm mở form
function openFormDetail() {
    document.querySelector(".title").textContent = "Thêm nhân viên";
    document.getElementById("frmDetail").style.display = "block";

}

// hàm đóng form
function closeFormDetail() {
    document.getElementById("frmDetail").style.display = "none";

}

//hàm check empty
function onValidateFieldEmpty() {
    try {
        let input = this;
        let errorText = this.nextElementSibling;
        const value = input.value;
        // kiểm tra value có trống hay không
        if (value.trim() == "".trim() || value == null || value == undefined) {
            input.style.borderColor = 'red';
            errorText.style.display = 'block';
        } else {
            errorText.style.display = 'none';
        }
    } catch (error) {

    }
}

//hàm check ngày tháng năm
function onValidateDate() {
    try {
        let errorText = this.nextElementSibling;

        //lấy ngày tháng trong form
        let input = this;
        const value = this.value;
        let dateEmployee = new Date(value);
        let yearEmployee = dateEmployee.getFullYear();
        let monthEmployee = dateEmployee.getMonth();
        let dayEmployee = dateEmployee.getDate();

        //lấy ngày tháng thực tế
        var now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth();
        let day = now.getDate();

        // kiểm tra ngày tháng phải nhỏ hơn ngày tháng hiện tại
        if (year < yearEmployee) {
            errorText.style.display = 'block';
        } else if (year == yearEmployee) {
            if (month < monthEmployee) {
                errorText.style.display = 'block';
            }
            else if (month == monthEmployee) {
                if (day < dayEmployee) {
                    errorText.style.display = 'block';
                } else {
                    errorText.style.display = 'none';
                }
            } else {
                errorText.style.display = 'none';
            }
        }
        else {
            errorText.style.display = 'none';
        }

    } catch (error) {
        console.log(error);
    }
}


//hàm kiểm tra có phải số đúng định dạng hay ko
function onValidateNumber() {
    try {
        let errorText = this.nextElementSibling;

        let input = this;
        const value = input.value;
        // console.log(value.length);
        let isNumber = isNaN(value);


        if (value.includes(".")) {
            errorText.style.display = 'block';
        } else {
            if (!isNumber) {
                errorText.style.display = 'none';
            } else {
                errorText.style.display = 'block';
            }
        }
        if (value.length != 10) {
            errorText.style.display = 'block';
        }

        if (value.length == 0) {
            errorText.style.display = 'none';
        }
    } catch (error) {
        console.log(error);
    }

}

//hàm kiểm tra email có đúng định dạng hay không
function onValidateEmail() {
    try {
        let errorText = this.nextElementSibling;

        let input = this;
        const value = input.value;
        if (value.trim() != "".trim()) {
            if (value.endsWith("@gmail.com")) {
                errorText.style.display = 'none';
            } else {
                errorText.style.display = 'block';
            }
        } else {
            errorText.style.display = 'none';
        }

    } catch (error) {
        console.log(error)
    }


}

//check all checkbox
function onCheckListAll() {
    try {
        let checkboxList = document.getElementsByName("checkbox");
        let checkListAll = document.getElementById("checkListAll");

        checkListAll.onclick = () => {
            for (const checkbox of checkboxList) {
                if (checkbox.checked != checkListAll.checked) {
                    checkbox.closest("tr").classList.toggle("selected-row");
                }
                checkbox.checked = checkListAll.checked;
            }
        }

        // check checkbox từng hàng
        checkboxList.forEach(function (e) {
            e.onclick = () => {
                e.closest("tr").classList.toggle("selected-row");
                let isCheckAll = true;
                if (!e.checked) {
                    checkListAll.checked = false;
                }
                else {
                    for (const checkbox of checkboxList) {
                        if (!checkbox.checked) {
                            isCheckAll = false;
                            break;
                        }
                    }
                    if (isCheckAll) {
                        checkListAll.checked = true;
                    }
                }
            }
        })

    } catch (error) {
        console.log(error);
    }

}


/**
 * Định dạng ngày tháng
 * 
 */
function formatDate(dateTime) {
    try {
        if (dateTime != null && dateTime != undefined) {
            // Chuyển thành dữ liệu ngày tháng:
            dateTime = new Date(dateTime);
            let date = dateTime.getDate();
            let month = dateTime.getMonth() + 1;
            let year = dateTime.getFullYear();

            if (date < 10) date = '0' + date;
            if (month < 10) month = '0' + month;
            // ghép ngày tháng năm lại
            return `${date}/${month}/${year}`;
        }
        else {
            return "";
        }

    } catch (error) {
        return "";
    }
}

/**
 * Định dạng tiền
 */
function formatMoney(money) {
    try {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money);
    } catch (error) {
        console.log(error);
        return "";
    }
}



