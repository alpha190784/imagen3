document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');

    const splitterLoss = {
        '1:2': 3.4,
        '1:4': 7.2,
        '1:8': 10.5,
        '1:16': 13.8,
        '1:32': 17.0,
        '1:64': 20.3,
        '2:8': 7.5, // Custom splitter ratios can be added
        '3:7': 5.0,
    };

    let previousOutputLaser = null;

    function createRow(isFirstRow = false) {
        const row = document.createElement('div');
        row.classList.add('grid-row');
        row.style.display = 'contents';

        // 1. INPUT LASER
        const inputLaserCell = document.createElement('div');
        inputLaserCell.classList.add('grid-item');
        const inputLaser = document.createElement('input');
        inputLaser.type = 'number';
        inputLaser.placeholder = 'dBm';
        if (isFirstRow) {
            inputLaser.addEventListener('input', () => calculateAllRows());
        } else {
            inputLaser.disabled = true;
        }
        inputLaserCell.appendChild(inputLaser);
        row.appendChild(inputLaserCell);

        // 2. SPLITER RATIO
        const spliterRatioCell = document.createElement('div');
        spliterRatioCell.classList.add('grid-item');
        const spliterRatioSelect = document.createElement('select');
        for (const ratio in splitterLoss) {
            const option = document.createElement('option');
            option.value = ratio;
            option.textContent = ratio;
            spliterRatioSelect.appendChild(option);
        }
        spliterRatioSelect.addEventListener('change', () => calculateAllRows());
        spliterRatioCell.appendChild(spliterRatioSelect);
        row.appendChild(spliterRatioCell);

        // 3. SPLITER PLC
        const spliterPlcCell = document.createElement('div');
        spliterPlcCell.classList.add('grid-item');
        row.appendChild(spliterPlcCell);

        // 4. OUTPUT LASER
        const outputLaserCell = document.createElement('div');
        outputLaserCell.classList.add('grid-item');
        outputLaserCell.textContent = '...';
        row.appendChild(outputLaserCell);

        // 5. NEXT ODP
        const nextOdpCell = document.createElement('div');
        nextOdpCell.classList.add('grid-item', 'row-actions');

        const nextOdpButton = document.createElement('button');
        nextOdpButton.textContent = '+ ODP';
        nextOdpButton.addEventListener('click', () => {
            createRow();
            nextOdpButton.disabled = true;
        });
        nextOdpCell.appendChild(nextOdpButton);

        if (!isFirstRow) {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn');
            deleteButton.addEventListener('click', () => {
                const prevRow = row.previousElementSibling;
                row.remove();
                if (prevRow) {
                    const addBtn = prevRow.querySelector('button:not(.delete-btn)');
                    if (addBtn) {
                        addBtn.disabled = false;
                    }
                }
                calculateAllRows();
            });
            nextOdpCell.appendChild(deleteButton);
        }
        
        row.appendChild(nextOdpCell);

        gridContainer.appendChild(row);
        calculateAllRows(); // Recalculate when a new row is added
    }

    function calculateAllRows() {
        const rows = gridContainer.querySelectorAll('.grid-row');
        let currentInput = null;

        rows.forEach((row, index) => {
            const inputLaserInput = row.children[0].querySelector('input');
            const spliterRatioSelect = row.children[1].querySelector('select');
            const spliterPlcCell = row.children[2];
            const outputLaserCell = row.children[3];

            const selectedRatio = spliterRatioSelect.value;
            const loss = splitterLoss[selectedRatio];
            spliterPlcCell.textContent = `${loss} dB`;

            if (index === 0) {
                currentInput = parseFloat(inputLaserInput.value);
            } else {
                 const prevRow = rows[index - 1];
                 const prevOutputLaserCell = prevRow.children[3];
                 currentInput = parseFloat(prevOutputLaserCell.textContent);
                 inputLaserInput.value = isNaN(currentInput) ? '' : currentInput.toFixed(2);
            }

            if (!isNaN(currentInput) && loss !== undefined) {
                const output = currentInput - loss;
                outputLaserCell.textContent = output.toFixed(2);
            } else {
                outputLaserCell.textContent = '...';
            }
        });
    }

    createRow(true); // Create the first row
}); 