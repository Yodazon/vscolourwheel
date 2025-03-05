export function getWebviewContent(selectedColour: string): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Colour Picker</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 10px; }
                .container { display: flex; flex-direction: column; align-items: center; gap: 10px; }
                input[type="color"], input[type="range"] { width: 100px; }
                .preview { width: 100px; height: 50px; border-radius: 5px; margin-top: 10px; border: 1px solid #ddd; }
            </style>
        </head>
        <body>
            <div class="container">
                <h3>Select a Colour</h3>
                <input type="color" id="colourPicker" value="${selectedColour}">
                
                <label>Brightness</label>
                <input type="range" id="brightnessSlider" min="0" max="200" value="100">
                
                <label>Saturation</label>
                <input type="range" id="saturationSlider" min="0" max="200" value="100">
                
                <div class="preview" id="colourPreview" style="background-color: ${selectedColour};"></div>
            </div>

            <script>
                const vscode = acquireVsCodeApi();
                const colourPicker = document.getElementById('colourPicker');
                const brightnessSlider = document.getElementById('brightnessSlider');
                const saturationSlider = document.getElementById('saturationSlider');
                const preview = document.getElementById('colourPreview');

                function adjustColour(hex, brightness, saturation) {
                    let [r, g, b] = hexToRgb(hex);

                    // Adjust brightness (0 = black, 200 = white, 100 = original)
                    let brightnessFactor = brightness / 100;
                    r = Math.min(255, r * brightnessFactor);
                    g = Math.min(255, g * brightnessFactor);
                    b = Math.min(255, b * brightnessFactor);

                    // Adjust saturation (0 = grayscale, 100 = original, 200 = oversaturated)
                    let avg = (r + g + b) / 3;
                    let saturationFactor = saturation / 100;
                    r = avg + (r - avg) * saturationFactor;
                    g = avg + (g - avg) * saturationFactor;
                    b = avg + (b - avg) * saturationFactor;

                    let newColour = rgbToHex(r, g, b);
                    preview.style.backgroundColor = newColour;
                    return newColour;
                }

                function hexToRgb(hex) {
                    let bigint = parseInt(hex.slice(1), 16);
                    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
                }

                function rgbToHex(r, g, b) {
                    return "#" + [r, g, b].map(x => Math.max(0, Math.min(255, Math.round(x))) // Clamp values
                        .toString(16).padStart(2, '0')).join('');
                }

                function updateColour() {
                    let adjustedColour = adjustColour(colourPicker.value, brightnessSlider.value, saturationSlider.value);
                    vscode.postMessage({ command: 'updateColour', colour: adjustedColour });
                }

                colourPicker.addEventListener('input', updateColour);
                brightnessSlider.addEventListener('input', updateColour);
                saturationSlider.addEventListener('input', updateColour);
            </script>
        </body>
        </html>
    `;
}