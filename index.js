  let count = 0;
        const counterElement = document.getElementById('counter');
        const incrementButton = document.getElementById('increment');
        const decrementButton = document.getElementById('decrement');
        const resetButton = document.getElementById('reset');
        const resetTimesElement = document.getElementById('reset-times');
        const decrementTimesElement = document.getElementById('decrement-times');
        const incrementTimesElement = document.getElementById('increment-times');
        let resetTimes = 0;
        let decrementTimes = 0;
        let incrementTimes = 0;


        incrementButton.addEventListener('click', () => {
            count++;
            counterElement.textContent = count;
            incrementTimes++;
            incrementTimesElement.textContent = incrementTimes;
        });

        decrementButton.addEventListener('click', () => {
            count--;
            counterElement.textContent = count;
            decrementTimes++;
            decrementTimesElement.textContent = decrementTimes;
        });

        resetButton.onclick = () => {
            if (count !== 0) {
                resetTimes++;
                resetTimesElement.textContent = resetTimes;
            }
            count = 0;
            counterElement.textContent = count;
        }