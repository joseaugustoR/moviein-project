import { FFmpeg } from '@ffmpeg/ffmpeg';

async function readerFileLargeScale(file: File) {
    const fileStream = file.stream();
    const reader = fileStream.getReader();
    // await f.load();

    try {
        let chunkNumber = 0;
        const CHUNK_SIZE = 100 * 1024 * 1024; // 100 MB chunk size (adjust as needed)
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const f = new FFmpeg();
            await f.load();
            
            await f.createDir("videos")

            let offset = 0;
            
            while (offset < value.length) {
                const chunk = value.slice(offset, offset + CHUNK_SIZE);
                offset += CHUNK_SIZE;

                // Write chunk to a temporary file
                const tempFilePath = `./videos/temp_chunk_${chunkNumber}.mp4`;

                await f.writeFile(tempFilePath, chunk);

                // Execute FFmpeg to segment the chunk
                const segmentOutputPath = `./videos/segment-${chunkNumber}.mp4`;
                await f.exec([
                    '-i', tempFilePath,
                    '-c', 'copy',
                    '-map', '0',
                    '-segment_time', '60',
                    '-f', 'segment',
                    segmentOutputPath
                ]);

                console.log(`Segment ${chunkNumber} processed`);



                // Clean up temporary file
                var er = await f.listDir("videos");
                if (er.find(r => r.name === `temp_chunk_${chunkNumber}.mp4`)) {
                    await f.deleteFile(tempFilePath);
                }
                if (er.find(d => d.name === `segment-${chunkNumber}.mp4`)) {
                    await f.deleteFile(segmentOutputPath)
                }
                await f.terminate();
                chunkNumber++;
            }
        }

    } catch (error: any) {
        console.log('Error processing video:', error.toString());

    } finally {
        // Terminate FFmpeg instance
        // await f.terminate();
    }
}

export default readerFileLargeScale;
