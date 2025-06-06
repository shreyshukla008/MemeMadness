
document.addEventListener("DOMContentLoaded", () => {
  
  

function handleUnifiedSearch() {
  const tagInput = document.getElementById('customTagInput').value.trim();

  if (tagInput && selectedTags.size === 0) {
    fetchCustomTagMemes();
  } else if (selectedTags.size > 0 && !tagInput) {
    fetchMemesByTags();
  } else if (tagInput && selectedTags.size > 0) {
    // Combine both
    let allPosts = [];
    document.getElementById('loader').classList.remove('hidden');
    fetch(`https://www.reddit.com/r/memes/search.json?q=${tagInput}&restrict_sr=true`)
      .then(res => res.json())
      .then(data => {
        const posts = data.data.children.filter(p => p.data.post_hint === 'image');
        allPosts.push(...posts);
        return Promise.all([...selectedTags].map(tag => fetch(`https://www.reddit.com/r/memes/search.json?q=${tag}&restrict_sr=true`).then(r => r.json())));
      })
      .then(responses => {
        responses.forEach(response => {
          const posts = response.data.children.filter(p => p.data.post_hint === 'image');
          allPosts.push(...posts);
        });

        if (allPosts.length === 0) {
          memeContainer.innerHTML = `<p class='text-red-400'>No memes found for combined search.</p>`;
          nextButton.classList.add('hidden');
          return;
        }

        allMemes = allPosts.map(p => p.data);
        currentIndex = 0;
        renderMemes(allMemes.slice(0, 5));
        nextButton.classList.remove('hidden');
      });
  } else {
    alert('Enter a tag or select at least one quick tag.');
  }
}

    const memeContainer = document.getElementById('memeContainer');
    const nextButton = document.getElementById('nextButton');
    let allMemes = [];
    let currentIndex = 0;
    let selectedTags = new Set();

    function toggleTag(button, tag) {
      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
        button.classList.remove('selected');
      } else {
        selectedTags.add(tag);
        button.classList.add('selected');
      }
    }

    async function fetchRandomMemes() {
      selectedTags.clear();
      document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('selected'));
      try {
        const res = await fetch('https://meme-api.com/gimme/5');
        const data = await res.json();
        renderMemes(data.memes);
        nextButton.classList.add('hidden');
      } catch (err) {
        console.error('Error fetching random memes:', err);
        memeContainer.innerHTML = `<p class='text-red-400'>Failed to fetch random memes.</p>`;
        nextButton.classList.add('hidden');
      }
    }

    async function fetchCustomTagMemes() {
      selectedTags.clear();
      document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('selected'));
      const tag = document.getElementById('customTagInput').value.trim();
      if (!tag) return alert('Please enter a tag');

      try {
        const res = await fetch(`https://www.reddit.com/r/memes/search.json?q=${tag}&restrict_sr=true`);
        const data = await res.json();
        const posts = data.data.children.filter(p => p.data.post_hint === 'image');

        if (posts.length === 0) {
          memeContainer.innerHTML = `<p class='text-red-400'>No memes found for the tag: <strong>${tag}</strong></p>`;
          nextButton.classList.add('hidden');
          return;
        }

        allMemes = posts.map(p => p.data);
        currentIndex = 0;
        renderMemes(allMemes.slice(0, 5));
        nextButton.classList.remove('hidden');
      } catch (err) {
        console.error('Error fetching memes:', err);
        memeContainer.innerHTML = `<p class='text-red-400'>Something went wrong. Please try again later.</p>`;
        nextButton.classList.add('hidden');
      }
    }

    async function fetchMemesByTags() {
      if (selectedTags.size === 0) return alert('Please select at least one tag');
      let allPosts = [];
      for (const tag of selectedTags) {
        const res = await fetch(`https://www.reddit.com/r/memes/search.json?q=${tag}&restrict_sr=true`);
        const data = await res.json();
        const posts = data.data.children.filter(p => p.data.post_hint === 'image');
        allPosts.push(...posts);
      }

      if (allPosts.length === 0) {
        memeContainer.innerHTML = `<p class='text-red-400'>No memes found for the selected tags.</p>`;
        nextButton.classList.add('hidden');
        return;
      }

      allMemes = allPosts.map(p => p.data);
      currentIndex = 0;
      renderMemes(allMemes.slice(0, 5));
      nextButton.classList.remove('hidden');
    }

    function showNextPage() {
      const nextSet = allMemes.slice(currentIndex + 5, currentIndex + 10);
      if (nextSet.length === 0) return;
      currentIndex += 5;
      renderMemes(nextSet);
    }

    function renderMemes(memes) {
      document.getElementById('loader').classList.remove('hidden');
      document.getElementById('loader').classList.add('hidden');
      memeContainer.innerHTML = memes.map(meme => `
        <div class="bg-gray-800 p-6 rounded shadow-md max-w-xl w-full self-center">
          <h2 class="text-xl font-semibold mb-2">${meme.title}</h2>
          <img src="${meme.url}" alt="Meme Image" class="w-full rounded" />
          <div class="flex justify-between mt-1"> 
            <p class="mt-2 text-sm text-gray-400">From: r/${meme.subreddit} | 👍 ${meme.ups}</p>
            <div class="flex gap-2 justify-end">
              <button onclick='saveMeme(${JSON.stringify(meme)})' class="mt-2 px-3 py-1 bg-green-500 hover:bg-green-700 rounded text-white text-sm">Save</button>
              <button
                onclick="sharePage()"
                class="mt-2 px-3 py-1 bg-blue-500 hover:bg-blue-700 rounded text-white text-sm"
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

    window.showToast = function (message) {
      const toast = document.getElementById("toast");
      toast.textContent = message;
      toast.classList.add("show");
    
      setTimeout(() => {
        toast.classList.remove("show");
      }, 3000); 
    }
    

    window.saveMeme = function (meme) {
      let saved = JSON.parse(localStorage.getItem('savedMemes')) || [];

      if (saved.some(m => m.url === meme.url)) {
        showToast("Meme already saved!");
        return;
      }

      if (saved.length >= 100) {
        showToast("Save limit reached (100 memes). Remove some from Saved Memes.");
        return;
      }

      meme.savedAt = new Date().toISOString();
      saved.unshift(meme);
      localStorage.setItem('savedMemes', JSON.stringify(saved));
      showToast("Meme saved!");
    }


    window.handleUnifiedSearch = handleUnifiedSearch;
    window.toggleTag = toggleTag;
    window.fetchRandomMemes = fetchRandomMemes;
    window.showNextPage = showNextPage;




    fetchRandomMemes();
 


});


