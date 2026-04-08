  let count = 0;
        const counterElement = document.getElementById('counter');
        const incrementButton = document.getElementById('increment');
        const decrementButton = document.getElementById('decrement');
        const resetButton = document.getElementById('reset');

        incrementButton.addEventListener('click', () => {
            count++;
            counterElement.textContent = count;
        });

        decrementButton.addEventListener('click', () => {
            count--;
            counterElement.textContent = count;
        });
        resetButton.onclick = () => {
            count = 0;
            counterElement.textContent = count;
        }