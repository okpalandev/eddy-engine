
let EddyTools = (function () {
    function canvas2Ascii(cvsId) {
        const cvs = document.getElementById(cvsId);
        const dataURL = cvs.toDataURL();
    
        if (!dataURL) {
            const ctx = cvs.getContext('2d');
            const imgData = ctx.getImageData(0, 0, cvs.width, cvs.height);
            const ascii = [];
            const length = imgData.data.length;
    
            for (let i = 0; i < length; i += 4) {
                const avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
                ascii.push(String.fromCharCode(avg));
            }
    
            return ascii.join('');
        } else {
            const base64Data = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
            const ascii = atob(base64Data);
            return ascii;
        }
    }
    return {
        canvas2Ascii
    }
})();
