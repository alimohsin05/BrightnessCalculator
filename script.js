function calculateHistogram(imageData) {
    const data = imageData.data;
    const redBuckets = new Array(256).fill(0);
    const greenBuckets = new Array(256).fill(0);
    const blueBuckets = new Array(256).fill(0);

    // Calculate histogram for each channel
    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        redBuckets[red]++;
        greenBuckets[green]++;
        blueBuckets[blue]++;
    }

    return { redBuckets, greenBuckets, blueBuckets };
}
//

function drawHistogram(histogramData) {
    const histogramCanvas = document.getElementById("histogram");
    const ctx = histogramCanvas.getContext("2d");

    const { redBuckets, greenBuckets, blueBuckets } = histogramData;
    const maxFrequency = Math.max(...redBuckets, ...greenBuckets, ...blueBuckets);
    const barWidth = histogramCanvas.width / 256;

    ctx.clearRect(0, 0, histogramCanvas.width, histogramCanvas.height);

    // Draw Red Histogram
    for (let i = 0; i < 256; i++) {
        const barHeight = (redBuckets[i] / maxFrequency) * histogramCanvas.height;
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // Semi-transparent red
        ctx.fillRect(i * barWidth, histogramCanvas.height - barHeight, barWidth, barHeight);
    }

    // Draw Green Histogram
    for (let i = 0; i < 256; i++) {
        const barHeight = (greenBuckets[i] / maxFrequency) * histogramCanvas.height;
        ctx.fillStyle = "rgba(0, 255, 0, 0.5)"; // Semi-transparent green
        ctx.fillRect(i * barWidth, histogramCanvas.height - barHeight, barWidth, barHeight);
    }

    // Draw Blue Histogram
    for (let i = 0; i < 256; i++) {
        const barHeight = (blueBuckets[i] / maxFrequency) * histogramCanvas.height;
        ctx.fillStyle = "rgba(0, 0, 255, 0.5)"; // Semi-transparent blue
        ctx.fillRect(i * barWidth, histogramCanvas.height - barHeight, barWidth, barHeight);
    }
}

function calculateBrightness() {
    const input = document.getElementById("imageUpload");
    const canvas = document.getElementById("canvas");
    const result = document.getElementById("result");
    const ctx = canvas.getContext("2d");

    // Ensure an image is selected
    if (!input.files || input.files.length === 0) {
        alert("Please upload an image.");
        return;
    }

    const file = input.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = function () {
        // Draw the image onto the canvas
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const histogramData = calculateHistogram(imageData);

        // Draw the histogram
        drawHistogram(histogramData);

        const data = imageData.data;

        // Variables for calculating brightness
        let sumRed = 0, sumGreen = 0, sumBlue = 0;
        const numPixels = canvas.width * canvas.height;

        // Loop through the pixel data
        for (let i = 0; i < data.length; i += 4) {
            const red = data[i];       // Red channel
            const green = data[i + 1]; // Green channel
            const blue = data[i + 2];  // Blue channel

            sumRed += red;
            sumGreen += green;
            sumBlue += blue;
        }

        // Calculate average brightness for each channel
        const avgRed = sumRed / numPixels;
        const avgGreen = sumGreen / numPixels;
        const avgBlue = sumBlue / numPixels;
        const avgBrightness = (avgRed + avgGreen + avgBlue) / 3;

        // Display results
        result.innerHTML = `
            <p><strong>Total Average Brightness:</strong> ${avgBrightness.toFixed(2)}</p>
            <div style="display: flex; align-items: center; margin: 5px 0;">
                <div style="width: 20px; height: 20px; background-color: red; margin-right: 10px;"></div>
                <p style="margin: 0;">Red Channel Brightness: ${avgRed.toFixed(2)}</p>
            </div>
            <div style="display: flex; align-items: center; margin: 5px 0;">
                <div style="width: 20px; height: 20px; background-color: green; margin-right: 10px;"></div>
                <p style="margin: 0;">Green Channel Brightness: ${avgGreen.toFixed(2)}</p>
            </div>
            <div style="display: flex; align-items: center; margin: 5px 0;">
                <div style="width: 20px; height: 20px; background-color: blue; margin-right: 10px;"></div>
                <p style="margin: 0;">Blue Channel Brightness: ${avgBlue.toFixed(2)}</p>
            </div>
        `;
        canvas.style.width = '50%';
        canvas.style.height = 'auto';
    };
}
