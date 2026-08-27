const nextBtn = document.getElementById("next-step-trintaquarenta");

nextBtn.addEventListener("click", async () => {
    const { ProximaSecao } = await import("./curso");
    ProximaSecao("mentalidade");
});