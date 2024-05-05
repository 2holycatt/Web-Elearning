document.addEventListener('DOMContentLoaded', function () {

    // layout_1
    const topicInput = document.getElementById('topicInput');
    const outputParagraph = document.getElementById('outputParagraph');
    // เลือก element ที่ต้องการตรวจสอบการเปลี่ยนแปลง
    const layout2Typing = document.querySelector('.layout-2-typing');
    const layout1Typing = document.querySelector('.layout-1-typing');

    // สร้าง MutationObserver
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            layout2Typing.style.height = 'fit-content !important';
            layout1Typing.style.height = 'fit-content !important';
        });
    });

    // กำหนดคอนฟิกสำหรับ MutationObserver
    const config = { attributes: true, childList: true, subtree: true };

    // เริ่มตรวจสอบการเปลี่ยนแปลงใน element ที่เลือก
    observer.observe(layout2Typing, config);
    observer.observe(layout1Typing, config);

    // เพิ่ม event listener เมื่อมีการเปลี่ยนแปลงใน input
    topicInput.addEventListener('input', function () {
        // รับค่าที่ผู้ใช้ป้อน
        const userInput = topicInput.value;
        // ตรวจสอบว่า input ว่างหรือไม่
        if (userInput.trim() === '') {
            // ถ้า input ว่าง ให้กำหนดข้อความเริ่มต้นใหม่ใน paragraph
            outputParagraph.innerHTML = '<i class="bi bi-1-circle-fill text-primary"></i>';
        } else {
            // ถ้า input ไม่ว่าง ให้แสดงผลค่าที่ผู้ใช้ป้อนใน paragraph
            outputParagraph.textContent = userInput;
        }
    });

    const topicInput2 = document.getElementById('topicInput2');
    const outputParagraph2 = document.getElementById('outputParagraph2');

    // เพิ่ม event listener เมื่อมีการเปลี่ยนแปลงใน input
    topicInput2.addEventListener('input', function () {
        // รับค่าที่ผู้ใช้ป้อน
        const userInput = topicInput2.value;
        // ตรวจสอบว่า input ว่างหรือไม่
        if (userInput.trim() === '') {
            // ถ้า input ว่าง ให้กำหนดข้อความเริ่มต้นใหม่ใน paragraph
            outputParagraph2.innerHTML = '<i class="bi bi-2-circle-fill text-primary"></i>';
        } else {
            // ถ้า input ไม่ว่าง ให้แสดงผลค่าที่ผู้ใช้ป้อนใน paragraph
            outputParagraph2.textContent = userInput;
        }
    });

    const topicInput3 = document.getElementById('topicInput3');
    const outputParagraph3 = document.getElementById('outputParagraph3');

    // เพิ่ม event listener เมื่อมีการเปลี่ยนแปลงใน input
    topicInput3.addEventListener('input', function () {
        // รับค่าที่ผู้ใช้ป้อน
        const userInput = topicInput3.value;
        // ตรวจสอบว่า input ว่างหรือไม่
        if (userInput.trim() === '') {
            // ถ้า input ว่าง ให้กำหนดข้อความเริ่มต้นใหม่ใน paragraph
            outputParagraph3.innerHTML = '<i class="bi bi-3-circle-fill text-primary"></i>';
        } else {
            // ถ้า input ไม่ว่าง ให้แสดงผลค่าที่ผู้ใช้ป้อนใน paragraph
            outputParagraph3.textContent = userInput;
        }
    });

    const topicInput4 = document.getElementById('topicInput4');
    const outputParagraph4 = document.getElementById('outputParagraph4');

    // เพิ่ม event listener เมื่อมีการเปลี่ยนแปลงใน input
    topicInput4.addEventListener('input', function () {
        // รับค่าที่ผู้ใช้ป้อน
        const userInput = topicInput4.value;
        // ตรวจสอบว่า input ว่างหรือไม่
        if (userInput.trim() === '') {
            // ถ้า input ว่าง ให้กำหนดข้อความเริ่มต้นใหม่ใน paragraph
            outputParagraph4.innerHTML = '<i class="bi bi-4-circle-fill text-primary"></i>';
        } else {
            // ถ้า input ไม่ว่าง ให้แสดงผลค่าที่ผู้ใช้ป้อนใน paragraph
            outputParagraph4.textContent = userInput;
        }
    });


    const topicInput6 = document.getElementById('topicInput6');
    const outputParagraph6 = document.getElementById('outputParagraph6');

    // เพิ่ม event listener เมื่อมีการเปลี่ยนแปลงใน input
    topicInput6.addEventListener('input', function () {
        // รับค่าที่ผู้ใช้ป้อน
        const userInput = topicInput6.value;
        // ตรวจสอบว่า input ว่างหรือไม่
        if (userInput.trim() === '') {
            // ถ้า input ว่าง ให้กำหนดข้อความเริ่มต้นใหม่ใน paragraph
            outputParagraph6.innerHTML = '<i class="bi bi-6-circle-fill text-primary"></i>';
        } else {
            // ถ้า input ไม่ว่าง ให้แสดงผลค่าที่ผู้ใช้ป้อนใน paragraph
            outputParagraph6.textContent = userInput;
        }
    });


    const topicInput7 = document.getElementById('topicInput7');
    const outputParagraph7 = document.getElementById('outputParagraph7');

    // เพิ่ม event listener เมื่อมีการเปลี่ยนแปลงใน input
    topicInput7.addEventListener('input', function () {
        // รับค่าที่ผู้ใช้ป้อน
        const userInput = topicInput7.value;
        // ตรวจสอบว่า input ว่างหรือไม่
        if (userInput.trim() === '') {
            // ถ้า input ว่าง ให้กำหนดข้อความเริ่มต้นใหม่ใน paragraph
            outputParagraph7.innerHTML = '<i class="bi bi-1-circle-fill text-primary"></i>';
        } else {
            // ถ้า input ไม่ว่าง ให้แสดงผลค่าที่ผู้ใช้ป้อนใน paragraph
            outputParagraph7.textContent = userInput;
        }
    });

    const topicInput8 = document.getElementById('topicInput8');
    const outputParagraph8 = document.getElementById('outputParagraph8');

    // เพิ่ม event listener เมื่อมีการเปลี่ยนแปลงใน input
    topicInput8.addEventListener('input', function () {
        // รับค่าที่ผู้ใช้ป้อน
        const userInput = topicInput8.value;
        // ตรวจสอบว่า input ว่างหรือไม่
        if (userInput.trim() === '') {
            // ถ้า input ว่าง ให้กำหนดข้อความเริ่มต้นใหม่ใน paragraph
            outputParagraph8.innerHTML = '<i class="bi bi-2-circle-fill text-primary" style="font-size:medium !important;"></i>';
        } else {
            // ถ้า input ไม่ว่าง ให้แสดงผลค่าที่ผู้ใช้ป้อนใน paragraph
            outputParagraph8.textContent = userInput;
        }
    });

    const topicInput9 = document.getElementById('topicInput9');
    const outputParagrapt9 = document.getElementById('outputParagraph9');

    // เพิ่ม event listener เมื่อมีการเปลี่ยนแปลงใน input
    topicInput9.addEventListener('input', function () {
        // รับค่าที่ผู้ใช้ป้อน
        const userInput = topicInput9.value;
        // ตรวจสอบว่า input ว่างหรือไม่
        if (userInput.trim() === '') {
            // ถ้า input ว่าง ให้กำหนดข้อความเริ่มต้นใหม่ใน paragraph
            outputParagrapt9.innerHTML = '<i class="bi bi-3-circle-fill text-primary" style="font-size:medium !important;"></i>';
        } else {
            // ถ้า input ไม่ว่าง ให้แสดงผลค่าที่ผู้ใช้ป้อนใน paragraph
            outputParagrapt9.textContent = userInput;
        }
    });

    const topicInput10 = document.getElementById('topicInput10');
    const outputParagraph10 = document.getElementById('outputParagraph10');

    // เพิ่ม event listener เมื่อมีการเปลี่ยนแปลงใน input
    topicInput10.addEventListener('input', function () {
        // รับค่าที่ผู้ใช้ป้อน
        const userInput = topicInput10.value;
        // ตรวจสอบว่า input ว่างหรือไม่
        if (userInput.trim() === '') {
            // ถ้า input ว่าง ให้กำหนดข้อความเริ่มต้นใหม่ใน paragraph
            outputParagraph10.innerHTML = '<i class="bi bi-4-circle-fill text-primary" style="font-size:medium !important;"></i>';
        } else {
            // ถ้า input ไม่ว่าง ให้แสดงผลค่าที่ผู้ใช้ป้อนใน paragraph
            outputParagraph10.textContent = userInput;
        }
    });

    const topicInput11 = document.getElementById('topicInput11');
    const outputParagraph11 = document.getElementById('outputParagraph11');

    // เพิ่ม event listener เมื่อมีการเปลี่ยนแปลงใน input
    topicInput11.addEventListener('input', function () {
        // รับค่าที่ผู้ใช้ป้อน
        const userInput = topicInput11.value;
        // ตรวจสอบว่า input ว่างหรือไม่
        if (userInput.trim() === '') {
            // ถ้า input ว่าง ให้กำหนดข้อความเริ่มต้นใหม่ใน paragraph
            outputParagraph11.innerHTML = '<i class="bi bi-1-circle-fill text-primary" style="font-size:medium !important;"></i>';
        } else {
            // ถ้า input ไม่ว่าง ให้แสดงผลค่าที่ผู้ใช้ป้อนใน paragraph
            outputParagraph11.textContent = userInput;
        }
    });
});

// function previewImage() {
//     var input = document.getElementById('topicInput5');
//     var preview = document.getElementById('imagePreview');

//     // ตรวจสอบว่ามีไฟล์ที่ถูกเลือกหรือไม่
//     if (input.files && input.files[0]) {
//         var reader = new FileReader();

//         reader.onload = function (e) {
//             var imgElement = document.createElement('img');
//             imgElement.src = e.target.result;
//             imgElement.classList.add('img-fluid');

//             // เคลียร์ element ที่มีอยู่ใน #imagePreview ก่อนแล้วค่อยเพิ่มภาพใหม่
//             while (preview.firstChild) {
//                 preview.removeChild(preview.firstChild);
//             }

//             preview.appendChild(imgElement);
//         }

//         reader.readAsDataURL(input.files[0]);
//     }
// }

const textElement = document.querySelector('.exaple-text');
const text = "เรื่องที่ 1 ส่วนประกอบฟันเทียม...";
let index = 0;
let isDeleting = false;

function animateText() {
    const speed = 80; // ความเร็วในการพิมพ์ (ms)

    // ตรวจสอบว่าต้องการลบหรือไม่
    if (isDeleting) {
        // ลบอักษร
        textElement.textContent = text.substring(0, index - 1);
        index--;
    } else {
        // เพิ่มอักษร
        textElement.textContent = text.substring(0, index + 1);
        index++;
    }

    // เปลี่ยนสถานะการลบหากเพิ่มหรือลบถึงจุดสุดท้ายของข้อความ
    if (index === text.length + 1) {
        isDeleting = true;
    }

    // เปลี่ยนสถานะการเพิ่มหากกลับสู่จุดเริ่มต้นของข้อความ
    if (index === 0) {
        isDeleting = false;
    }

    // กำหนดเวลาในการเรียกฟังก์ชันแบบละเอียด
    setTimeout(animateText, isDeleting ? 50 : speed);
}

// เริ่มการเรียกใช้งานฟังก์ชัน animation
animateText();

const textElement2 = document.querySelector('.example-text-2');
const text2 = "เรื่องที่ 2 วัสดุที่ใช้ในการทำ...";
let index2 = 0;
let isDeleting2 = false;

function animateText2() {
    const speed = 80; // ความเร็วในการพิมพ์ (ms)

    // ตรวจสอบว่าต้องการลบหรือไม่
    if (isDeleting2) {
        // ลบอักษร
        textElement2.textContent = text2.substring(0, index2 - 1);
        index2--;
    } else {
        // เพิ่มอักษร
        textElement2.textContent = text2.substring(0, index2 + 1);
        index2++;
    }

    // เปลี่ยนสถานะการลบหากเพิ่มหรือลบถึงจุดสุดท้ายของข้อความ
    if (index2 === text2.length + 1) {
        isDeleting2 = true;
    }

    // เปลี่ยนสถานะการเพิ่มหากกลับสู่จุดเริ่มต้นของข้อความ
    if (index2 === 0) {
        isDeleting2 = false;
    }

    // กำหนดเวลาในการเรียกฟังก์ชันแบบละเอียด
    setTimeout(animateText2, isDeleting2 ? 50 : speed);
}

// เริ่มการเรียกใช้งานฟังก์ชัน animation
animateText2();


const textElement3 = document.querySelector('.example-text-3');
const text3 = "เรื่องที่ 3 วัสดุที่ใช้ในการทำ...";
let index3 = 0;
let isDeleting3 = false;

function animateText3() {
    const speed = 80; // ความเร็วในการพิมพ์ (ms)

    // ตรวจสอบว่าต้องการลบหรือไม่
    if (isDeleting3) {
        // ลบอักษร
        textElement3.textContent = text3.substring(0, index3 - 1);
        index3--;
    } else {
        // เพิ่มอักษร
        textElement3.textContent = text3.substring(0, index3 + 1);
        index3++;
    }

    // เปลี่ยนสถานะการลบหากเพิ่มหรือลบถึงจุดสุดท้ายของข้อความ
    if (index3 === text3.length + 1) {
        isDeleting3 = true;
    }

    // เปลี่ยนสถานะการเพิ่มหากกลับสู่จุดเริ่มต้นของข้อความ
    if (index3 === 0) {
        isDeleting3 = false;
    }

    // กำหนดเวลาในการเรียกฟังก์ชันแบบละเอียด
    setTimeout(animateText3, isDeleting2 ? 50 : speed);
}

// เริ่มการเรียกใช้งานฟังก์ชัน animation
animateText3();

