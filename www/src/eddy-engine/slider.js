document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('eddy-canvas');
    const ctx = canvas.getContext('2d');
    
    const slider = {
        x: 10,
        y: canvas.height / 2,
        width: canvas.width - 20,
        height: 10,
        trackerPosition: 0,
        dragging: false,
        offset: 0 // Offset between mouse position and slider position
    };

    function drawSlider() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw track
        ctx.fillStyle = '#ccc';
        ctx.fillRect(slider.x, slider.y - slider.height / 2, slider.width, slider.height);

        // Draw slider
        ctx.fillStyle = '#007bff';
        ctx.fillRect(slider.x + slider.trackerPosition * slider.width, slider.y - slider.height / 2, slider.height, slider.height);
    }
    
    function updateTrackerPosition(x) {
        // Calculate the new position of the slider based on mouseX
        let newPosition = x - canvas.offsetLeft - slider.x - slider.offset;
        newPosition = Math.max(0, Math.min(newPosition, slider.width)); // Ensure within slider width
        slider.trackerPosition = newPosition / slider.width;
        drawSlider();
    }
    

    function updateSliderPosition(y) {
        
        // Calculate the new position of the slider based on mouseY
        let newPosition = y - canvas.offsetTop - slider.height / 2;
        newPosition = Math.max(0, Math.min(newPosition, canvas.height - slider.height)); // Ensure within canvas bounds
        slider.y = newPosition;
        drawSlider();
    }
    
    
    const handleStart = (event) => {
        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        let mouseX, mouseY, touch;
        
        if (event.type === 'mousedown') {
            mouseX = event.clientX - rect.left;
            mouseY = event.clientY - rect.top;
        } else if (event.type === 'touchstart') {
            touch = event.touches[0];
            mouseX = touch.clientX - rect.left;
            mouseY = touch.clientY - rect.top;
        }
       
        // Check if the click or touch is within the slider bounds
        if (
            mouseX >= slider.x + slider.trackerPosition * slider.width &&
            mouseX <= slider.x + slider.trackerPosition * slider.width + slider.height &&
            mouseY >= slider.y - slider.height / 2 &&
            mouseY <= slider.y + slider.height / 2
        ) {
            slider.dragging = true;
            slider.offset = mouseX - (slider.x + slider.trackerPosition * slider.width);
        }
    }
    

    const handleMove = (event) => {
        event.preventDefault();
        if (slider.dragging) {
            const rect = canvas.getBoundingClientRect();
            let mouseX, mouseY, touch;
    
            if (event.type === 'mousemove') {
                mouseX = event.clientX - rect.left;
                mouseY = event.clientY - rect.top;
            } else if (event.type === 'touchmove') {
                touch = event.touches[0];
                mouseX = touch.clientX - rect.left;
                mouseY = touch.clientY - rect.top;
            }
            
            // Ensure mouseY stays within the canvas bounds
            mouseY = Math.max(slider.height / 2, Math.min(canvas.height - slider.height / 2, mouseY));
    
            updateSliderPosition(mouseY + canvas.offsetTop + slider.height ); 
            updateTrackerPosition(mouseX + canvas.offsetLeft );
        }
    }
    
    const handleEnd = (event) => {
        event.preventDefault();
        slider.dragging = false;
    }
    

    const handleScroll = () => {
        updateTrackerPosition(window.scrollY + canvas.offsetTop + slider.height / 2);
        drawSlider();
    }

    // Attach scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Attach event listeners to the canvas
    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    // Touch events
    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('touchend', handleEnd);
    
    drawSlider();
});
