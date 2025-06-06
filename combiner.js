function downloadCombinedImage() {
  const canvas = document.getElementById('combineCanvas');
  const aspectRatio = parseFloat(document.getElementById('resolution').value);
  const width = canvas.width;
  const height = Math.round(width / aspectRatio);

  const resizedCanvas = document.createElement('canvas');
  resizedCanvas.width = width;
  resizedCanvas.height = height;

  const ctx = resizedCanvas.getContext('2d');
  ctx.drawImage(canvas, 0, 0, width, height);

  const link = document.createElement('a');
  link.download = 'combined-meme.png';
  link.href = resizedCanvas.toDataURL('image/png');
  link.click();
}

function combineImages() {
      const img1Input = document.getElementById('img1');
      const img2Input = document.getElementById('img2');
      const layout = document.getElementById('layout').value;
      const ratio = parseFloat(document.getElementById('ratio').value);
      const canvas = document.getElementById('combineCanvas');
      const ctx = canvas.getContext('2d');

      if (!img1Input.files[0] || !img2Input.files[0]) {
        alert('Please select both images.');
        return;
      }

      const img1 = new Image();
      const img2 = new Image();

      const reader1 = new FileReader();
      const reader2 = new FileReader();

      reader1.onload = function (e) {
        img1.src = e.target.result;
      };
      reader2.onload = function (e) {
        img2.src = e.target.result;
      };

      reader1.readAsDataURL(img1Input.files[0]);
      reader2.readAsDataURL(img2Input.files[0]);

      // Ensure both images are loaded before combining
      Promise.all([
        new Promise((resolve) => img1.onload = resolve),
        new Promise((resolve) => img2.onload = resolve)
      ]).then(() => {
        let width, height, canvasCombined;

        // Create a temporary canvas to combine both images
        canvasCombined = document.createElement('canvas');
        const ctxCombined = canvasCombined.getContext('2d');

        if (layout === 'vertical') {
          width = Math.max(img1.width, img2.width);
          height = img1.height + img2.height;
          const h1 = height * ratio;
          const h2 = height - h1;
          canvasCombined.width = width;
          canvasCombined.height = height;
          ctxCombined.drawImage(img1, 0, 0, width, h1);
          ctxCombined.drawImage(img2, 0, h1, width, h2);
        } else {
          width = img1.width + img2.width;
          height = Math.max(img1.height, img2.height);
          const w1 = width * ratio;
          const w2 = width - w1;
          canvasCombined.width = width;
          canvasCombined.height = height;
          ctxCombined.drawImage(img1, 0, 0, w1, height);
          ctxCombined.drawImage(img2, w1, 0, w2, height);
        }

        // Now resize to final aspect ratio for preview
        const aspectRatio = parseFloat(document.getElementById('resolution').value);
        const finalWidth = canvasCombined.width;
        const finalHeight = Math.round(finalWidth / aspectRatio);

        canvas.width = finalWidth;
        canvas.height = finalHeight;
        ctx.clearRect(0, 0, finalWidth, finalHeight);
        ctx.drawImage(canvasCombined, 0, 0, finalWidth, finalHeight);

        // Caption placement variables
        const img1Region = layout === 'vertical'
          ? { x: 0, y: 0, w: finalWidth, h: finalHeight * ratio }
          : { x: 0, y: 0, w: finalWidth * ratio, h: finalHeight };

        const img2Region = layout === 'vertical'
          ? { x: 0, y: finalHeight * ratio, w: finalWidth, h: finalHeight * (1 - ratio) }
          : { x: finalWidth * ratio, y: 0, w: finalWidth * (1 - ratio), h: finalHeight };

        function drawCaption(region, text, size, fontColor, bgColor, transparent, position) {
          ctx.font = `${size}px Impact`;
          ctx.textAlign = 'center';
          ctx.fillStyle = fontColor;
          ctx.strokeStyle = 'black';
          const textWidth = ctx.measureText(text).width;
          const textHeight = size * 1.2;
          const x = region.x + region.w / 2;
          const y = position === 'top' ? region.y + textHeight : region.y + region.h - 10;

          if (!transparent) {
            ctx.fillStyle = bgColor;
            ctx.fillRect(x - textWidth / 2 - 10, y - textHeight + 5, textWidth + 20, textHeight);
          }

          ctx.fillStyle = fontColor;
          ctx.fillText(text, x, y);
          ctx.strokeText(text, x, y);
        }

        // Draw captions dynamically
        drawCaption(img1Region,
          document.getElementById('img1TopText').value,
          parseInt(document.getElementById('img1TopFontSize').value),
          document.getElementById('img1TopFontColor').value,
          document.getElementById('img1TopBgColor').value,
          document.getElementById('img1TopTransparentBg').checked,
          'top');

        drawCaption(img1Region,
          document.getElementById('img1BottomText').value,
          parseInt(document.getElementById('img1BottomFontSize').value),
          document.getElementById('img1BottomFontColor').value,
          document.getElementById('img1BottomBgColor').value,
          document.getElementById('img1BottomTransparentBg').checked,
          'bottom');

        drawCaption(img2Region,
          document.getElementById('img2TopText').value,
          parseInt(document.getElementById('img2TopFontSize').value),
          document.getElementById('img2TopFontColor').value,
          document.getElementById('img2TopBgColor').value,
          document.getElementById('img2TopTransparentBg').checked,
          'top');

        drawCaption(img2Region,
          document.getElementById('img2BottomText').value,
          parseInt(document.getElementById('img2BottomFontSize').value),
          document.getElementById('img2BottomFontColor').value,
          document.getElementById('img2BottomBgColor').value,
          document.getElementById('img2BottomTransparentBg').checked,
          'bottom');

        
      });

      
    }


	function togglePanel(id, button) {
      	const panel = document.getElementById(id);
      	const isHidden = panel.classList.toggle("hidden");
      	button.innerHTML = button.innerHTML.replace(isHidden ? "▲" : "▼", 		isHidden ? "▼" : "▲");
    }
  