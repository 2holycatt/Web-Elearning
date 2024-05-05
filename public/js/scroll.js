(() => {
    function onScroll() {
        const classRoom = document.querySelector('.classroomDiv');
        // const classRoom2 = document.querySelector('.classroomDiv2');
      

        classRoom.style.transform = `translateY(${window.scrollY * 1.1}%)`;
        // classRoom2.style.transform = `translateY(${window.scrollY * 1.4}%)`;
        const boxes = document.querySelector('.box');
    }


    function run() {
        document.addEventListener('scroll', onScroll)
    }

    run()
})();