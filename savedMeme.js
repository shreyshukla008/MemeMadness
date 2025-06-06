    const savedContainer = document.getElementById('savedContainer');
    const emptyMessage = document.getElementById('emptyMessage');

    function loadSavedMemes() {
      const saved = JSON.parse(localStorage.getItem('savedMemes')) || [];

      if (saved.length === 0) {
        emptyMessage.classList.remove('hidden');
        return;
      }


      savedContainer.innerHTML = saved.map(meme => `
        <div class="bg-gray-800 p-6 rounded shadow-md">
          <h2 class="text-lg font-semibold mb-2">${meme.title}</h2>
          <img src="${meme.url}" alt="Meme Image" class="w-full rounded mb-2" />
          <p class="text-sm text-gray-400 mb-2">Saved on: ${formatTime(meme.savedAt)}</p>
          <div class="flex justify-between mt-1"> 
            <p class="mt-2 text-sm text-gray-400">From: r/${meme.subreddit} | 👍 ${meme.ups}</p>
            <div class="flex gap-2 justify-end">
              <button onclick="removeMeme('${meme.url}')" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm">
            Remove
          </button>
              <button
                onclick="sharePage()"
                class=" bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
              >
                Share
              </button>
            </div>
          </div>
          
        </div>
      `).join('');
    }

    window.sharePage = function() {
  
      const shareData = {
        title: document.title,
        text: `🔥 Check out this meme: ${document.title}`,
        url: window.location.href,
      };
    
      if (navigator.share) {
        navigator.share(shareData).catch((err) => {
          console.error('Sharing failed', err);
        });
      } else {
        // Fallback for WhatsApp
        const message = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
        const encoded = encodeURIComponent(message);
        const wa = `https://wa.me/?text=${encoded}`;
        window.open(wa, '_blank');
      }
    }

    function removeMeme(url) {
      let saved = JSON.parse(localStorage.getItem('savedMemes')) || [];
      saved = saved.filter(m => m.url !== url);
      localStorage.setItem('savedMemes', JSON.stringify(saved));
      loadSavedMemes();
    }

    function formatTime(isoString) {
      const date = new Date(isoString);
      return date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    }

    loadSavedMemes();
  