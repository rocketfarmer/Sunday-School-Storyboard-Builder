export async function downloadImage(url: string, filename: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}

export async function downloadAllImages(
  images: Array<{ imageUrl: string }>,
  storyTitle: string
) {
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const filename = `${storyTitle.replace(/[^a-z0-9]/gi, '_')}_scene_${i + 1}.jpg`;
    await downloadImage(image.imageUrl, filename);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}
