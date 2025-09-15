const queryInput = document.getElementById('query');
const downloadBtn = document.getElementById('download-btn');
const loadingDiv = document.getElementById('loading');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');

downloadBtn.addEventListener('click', fetchSong);
queryInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') fetchSong(); });

async function fetchSong() {
    const query = queryInput.value.trim();
    if (!query) return showError("Please enter a song name or URL.");

    hideError();
    resultDiv.style.display = 'none';
    loadingDiv.style.display = 'block';
    downloadBtn.disabled = true;

    try {
        const res = await fetch(`/api/ytmp3?${query.startsWith('http') ? `url=${encodeURIComponent(query)}` : `query=${encodeURIComponent(query)}`}`);
        const data = await res.json();

        if (res.status !== 200) throw new Error(data.error || "Failed to fetch song.");

        displayResult(data);

    } catch (err) {
        showError(err.message);
    } finally {
        loadingDiv.style.display = 'none';
        downloadBtn.disabled = false;
    }
}

function displayResult(data) {
    const meta = data.metadata;
    const title = meta.title || 'Unknown';
    const thumbnail = meta.thumbnail || '';
    const downloadUrl = data.download.url;

    resultDiv.innerHTML = `
        ${thumbnail ? `<img src="${thumbnail}" width="200">` : ''}
        <p>Title: ${title}</p>
        <a href="${downloadUrl}" download="${title.replace(/[^a-z0-9]/gi,'_')}.mp3">Download MP3</a>
    `;
    resultDiv.style.display = 'block';
}

function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
}

function hideError() {
    errorDiv.style.display = 'none';
}
