
const userProfile = document.querySelector("#user-profile")
userProfile.addEventListener('click', () => {
    const profileManage = document.querySelector(".profile-manage")
    const className = profileManage.className
    setTimeout(() => {
        if (className.includes("toggle-on")) {
            profileManage.classList.remove("toggle-on");
        } else {
            profileManage.classList.add("toggle-on");
        }
    }, 40)
})

document.addEventListener('click', (event) => {
    const toggleOn = document.querySelectorAll(".toggle-on")
    toggleOn.forEach(e => {
        e.classList.toggle('toggle-on')
    });
});

document.forms['upload-profile-form'].addEventListener('change', () => {
    document.forms['upload-profile-form'].submit()
})

const modalProfile = (img)=>{
    Swal.fire({
        imageUrl: `/images/profile/${img}`,
        imageWidth: 400,
        imageHeight: 'auto',
        imageAlt: 'Custom image',
    })
}