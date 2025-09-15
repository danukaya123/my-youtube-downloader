import fetch from "node-fetch";

export default async function handler(req, res) {
    const { url, query } = req.query;

    try {
        let videoUrl = url;

        // If query is a search term
        if (!videoUrl && query) {
            const searchRes = await fetch(`https://api.vreden.my.id/api/youtube?query=${encodeURIComponent(query)}`);
            const searchData = await searchRes.json();
            
            if (!searchData.result || !searchData.result.videos?.length) {
                return res.status(404).json({ error: "No video found." });
            }

            videoUrl = searchData.result.videos[0].url;
        }

        if (!videoUrl) return res.status(400).json({ error: "No URL or query provided." });

        // Fetch MP3 download link
        const mp3Res = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(videoUrl)}`);
        const mp3Data = await mp3Res.json();

        if (mp3Data.status !== 200 || !mp3Data.result?.download?.url) {
            return res.status(500).json({ error: mp3Data.message || "Failed to fetch MP3." });
        }

        res.status(200).json(mp3Data.result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || "Something went wrong." });
    }
}
