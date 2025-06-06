 const canvas = document.getElementById("memeCanvas");
  const ctx = canvas.getContext("2d");
  let currentImage = null;

  // const sticker = new Image();
  // sticker.src = "https://i.imgur.com/YOwVj3y.png";
  // sticker.onload = () => {
  //   canvas.width = 500;
  //   canvas.height = 500;
  //   ctx.drawImage(sticker, 0, 0, canvas.width, canvas.height);
  // };

document.getElementById("imageUpload").addEventListener("change", function () {
  // Show filename
  document.getElementById("fileName").textContent = this.files[0]?.name || "No file chosen";

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      const maxWidth = 500;
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      currentImage = img;
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(this.files[0]);
});

  function generateMeme() {
    if (!currentImage) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);

    const topText = document.getElementById("topText").value;
    const bottomText = document.getElementById("bottomText").value;
    const topSize = document.getElementById("topFontSize").value;
    const bottomSize = document.getElementById("bottomFontSize").value;

    const topFontColor = document.getElementById("topFontColor").value;
    const topBgColor = document.getElementById("topBgColor").value;
    const topTransparent = document.getElementById("topTransparentBg").checked;

    const bottomFontColor = document.getElementById("bottomFontColor").value;
    const bottomBgColor = document.getElementById("bottomBgColor").value;
    const bottomTransparent = document.getElementById("bottomTransparentBg").checked;

    ctx.textAlign = "center";
    ctx.lineWidth = 2;

    ctx.font = `${topSize}px Impact`;
    if (!topTransparent) {
      const topWidth = ctx.measureText(topText).width;
      const topHeight = topSize * 1.2;
      ctx.fillStyle = topBgColor;
      ctx.fillRect(canvas.width / 2 - topWidth / 2 - 10, 50 - topSize, topWidth + 20, topHeight);
    }
    ctx.fillStyle = topFontColor;
    ctx.strokeStyle = "black";
    ctx.fillText(topText, canvas.width / 2, 50);
    ctx.strokeText(topText, canvas.width / 2, 50);

    ctx.font = `${bottomSize}px Impact`;
    if (!bottomTransparent) {
      const botWidth = ctx.measureText(bottomText).width;
      const botHeight = bottomSize * 1.2;
      ctx.fillStyle = bottomBgColor;
      ctx.fillRect(canvas.width / 2 - botWidth / 2 - 10, canvas.height - 20 - bottomSize, botWidth + 20, botHeight);
    }
    ctx.fillStyle = bottomFontColor;
    ctx.strokeStyle = "black";
    ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);
    ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20);
  }

  function resetCanvas() {
    currentImage = null;
    canvas.width = 500;
    canvas.height = 500;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(sticker, 0, 0, canvas.width, canvas.height);
    document.getElementById("topText").value = "";
    document.getElementById("bottomText").value = "";
    document.getElementById("topFontSize").value = 40;
    document.getElementById("bottomFontSize").value = 40;
    document.getElementById("topFontColor").value = "#ffffff";
    document.getElementById("bottomFontColor").value = "#ffffff";
    document.getElementById("topBgColor").value = "#000000";
    document.getElementById("bottomBgColor").value = "#000000";
    document.getElementById("topTransparentBg").checked = false;
    document.getElementById("bottomTransparentBg").checked = false;
  }

  function downloadMeme() {
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }
