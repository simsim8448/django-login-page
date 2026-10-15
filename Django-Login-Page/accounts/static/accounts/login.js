const scene = document.getElementById("scene");
const beam = document.getElementById("lightBeam");
const character = document.getElementById("character");
const darkness = document.getElementById("darkness");
const loginCard = document.getElementById("loginCard");

let isLightOnCard = false;

// بررسی برخورد پرتو نور با محدوده فرم
function checkLightOnCard(startX, startY, angle, length, sceneRect) {
    const cardRect = loginCard.getBoundingClientRect();

    // مختصات فرم نسبت به صحنه
    const left = cardRect.left - sceneRect.left;
    const right = cardRect.right - sceneRect.left;
    const top = cardRect.top - sceneRect.top;
    const bottom = cardRect.bottom - sceneRect.top;

    // بررسی چند نقطه در اطراف فرم
    const points = [
        [left, top],
        [right, top],
        [left, bottom],
        [right, bottom],
        [(left + right) / 2, (top + bottom) / 2]
    ];

    const beamWidth = 75;
    const maxLength = length + 30;

    for (const [x, y] of points) {
        const dx = x - startX;
        const dy = y - startY;

        const distance = Math.hypot(dx, dy);

        const pointAngle = Math.atan2(dy, dx);

        let difference = Math.abs(pointAngle - angle);

        if (difference > Math.PI) {
            difference = 2 * Math.PI - difference;
        }

        // فاصله جانبی نقطه از مسیر نور
        const sideDistance = distance * Math.sin(difference);

        const isInBeam =
            distance >= 0 &&
            distance <= maxLength &&
            sideDistance <= beamWidth &&
            Math.cos(difference) > 0;

        if (isInBeam) {
            return true;
        }
    }

    return false;
}

// حرکت چراغ‌قوه
function moveLight(event) {
    if (!scene || !beam || !character || !loginCard) {
        return;
    }

    const sceneRect = scene.getBoundingClientRect();
    const characterRect = character.getBoundingClientRect();

    // نقطه شروع نور در نزدیکی چراغ‌قوه
    const startX =
        characterRect.left -
        sceneRect.left +
        characterRect.width * 0.90;

    const startY =
        characterRect.top -
        sceneRect.top +
        characterRect.height * 0.20;

    // موقعیت موس یا انگشت
    let clientX;
    let clientY;

    if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }

    const mouseX = clientX - sceneRect.left;
    const mouseY = clientY - sceneRect.top;

    const dx = mouseX - startX;
    const dy = mouseY - startY;

    const angle = Math.atan2(dy, dx);
    const angleDegrees = angle * (180 / Math.PI);
    const length = Math.hypot(dx, dy);

    // تنظیم پرتو نور
    beam.style.left = `${startX}px`;
    beam.style.top = `${startY - 75}px`;

    beam.style.setProperty("--beam-angle", `${angleDegrees}deg`);
    beam.style.setProperty("--beam-length", `${Math.max(length, 1)}px`);

    // بررسی برخورد نور با فرم
    const lightHitsCard = checkLightOnCard(
        startX,
        startY,
        angle,
        length,
        sceneRect
    );

    // تغییر وضعیت فرم
    if (lightHitsCard !== isLightOnCard) {
        isLightOnCard = lightHitsCard;

        loginCard.classList.toggle("login-visible", isLightOnCard);
        darkness?.classList.toggle("light-on", isLightOnCard);
    }
}

// حرکت موس
scene?.addEventListener("mousemove", moveLight);

// حرکت انگشت روی موبایل
scene?.addEventListener("touchmove", moveLight, {
    passive: true
});

// وقتی موس از صفحه خارج می‌شود، وضعیت فرم تغییر نکند.
// نمایش و مخفی کردن رمز عبور
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword?.addEventListener("click", function () {
    if (!passwordInput) {
        return;
    }

    const shouldShow = passwordInput.type === "password";

    passwordInput.type = shouldShow ? "text" : "password";

    togglePassword.setAttribute(
        "aria-label",
        shouldShow ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"
    );
});

// برای آزمایش در صورت نیاز می‌توانی در کنسول بنویسی:
// document.getElementById("loginCard").classList.add("login-visible");