document.addEventListener('DOMContentLoaded', function () {
    // Add loading animation to operation buttons
    const operationButtons = document.querySelectorAll('.operation-button');
    const additionContainer = document.getElementById('addition-container');
    const performAdditionButton = document.getElementById('perform-addition');
    const binaryInput1 = document.getElementById('binary-input1');
    const binaryInput2 = document.getElementById('binary-input2');
    const binaryResult = document.getElementById('binary-result');
    const octalResult = document.getElementById('octal-result');
    const decimalResult = document.getElementById('decimal-result');
    const hexResult = document.getElementById('hex-result');

    // Division elements
    const divisionContainer = document.getElementById('division-container');
    const performDivisionButton = document.getElementById('perform-division');
    const binaryInputDividend = document.getElementById('binary-input-dividend');
    const binaryInputDivisor = document.getElementById('binary-input-divisor');
    const binaryDivisionResult = document.getElementById('binary-division-result');
    const octalDivisionResult = document.getElementById('octal-division-result');
    const decimalDivisionResult = document.getElementById('decimal-division-result');
    const hexDivisionResult = document.getElementById('hex-division-result');

    // Multiplication elements
    const multiplicationContainer = document.getElementById('multiplication-container');
    const performMultiplicationButton = document.getElementById('perform-multiplication');
    const binaryInputMultiplicand = document.getElementById('binary-input-multiplicand');
    const binaryInputMultiplier = document.getElementById('binary-input-multiplier');
    const binaryMultiplicationResult = document.getElementById('binary-multiplication-result');
    const octalMultiplicationResult = document.getElementById('octal-multiplication-result');
    const decimalMultiplicationResult = document.getElementById('decimal-multiplication-result');
    const hexMultiplicationResult = document.getElementById('hex-multiplication-result');

    // 2's Complement elements
    const complementContainer = document.getElementById('complement-container');
    const performComplementButton = document.getElementById('perform-complement');
    const binaryInputComplement = document.getElementById('binary-input-complement');
    const binaryComplementResult = document.getElementById('binary-complement-result');
    const octalComplementResult = document.getElementById('octal-complement-result');
    const decimalComplementResult = document.getElementById('decimal-complement-result');
    const hexComplementResult = document.getElementById('hex-complement-result');

    // Subtraction elements
    const subtractContainer = document.getElementById('subtraction-container');
    const performSubtractionButton = document.getElementById('perform-subtraction');
    const binaryInputMinuend = document.getElementById('binary-input-minuend');
    const binaryInputSubtrahend = document.getElementById('binary-input-subtrahend');
    const binarySubtractionResult = document.getElementById('binary-subtraction-result');
    const octalSubtractionResult = document.getElementById('octal-subtraction-result');
    const decimalSubtractionResult = document.getElementById('decimal-subtraction-result');
    const hexSubtractionResult = document.getElementById('hex-subtraction-result');

    const returnButton = document.getElementById('return-container');
    const menuButtons = document.querySelector('.menu-buttons');

    returnButton.addEventListener('click', function () {
        // Hide all operation containers and return button
        [additionContainer, divisionContainer, multiplicationContainer, complementContainer, subtractContainer].forEach(container => {
            container.style.display = 'none';
        });
        returnButton.style.display = 'none';

        // Show menu buttons
        menuButtons.style.display = 'flex';

        // Reset operation buttons
        operationButtons.forEach(button => {
            button.style.opacity = '1';
            button.textContent = button.dataset.operation.charAt(0).toUpperCase() + button.dataset.operation.slice(1);
        });
    });

    operationButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const operation = this.dataset.operation;
            this.style.opacity = '0.7';
            this.textContent = 'Loading...';

            // Hide all operation containers
            [additionContainer, divisionContainer, multiplicationContainer, complementContainer, subtractContainer].forEach(container => {
                container.style.display = 'none';
            });

            // Show the selected operation container and return button
            menuButtons.style.display = 'none';
            returnButton.style.display = 'block';
            switch (operation) {
                case 'addition':
                    additionContainer.style.display = 'block';
                    break;
                case 'division':
                    divisionContainer.style.display = 'block';
                    break;
                case 'multiplication':
                    multiplicationContainer.style.display = 'block';
                    break;
                case 'complement':
                    complementContainer.style.display = 'block';
                    break;
                case 'subtraction':
                    subtractContainer.style.display = 'block';
                    break;
            }
        });
    });

    performAdditionButton.addEventListener('click', function () {
        const input1 = convertToNibbleFormatInput(binaryInput1.value.trim());
        const input2 = convertToNibbleFormatInput(binaryInput2.value.trim());

        if (!isValidSignedBinaryInput(input1) || !isValidSignedBinaryInput(input2)) {
            alert('Invalid signed binary input. The first bit indicates sign (0 for positive, 1 for negative).');
            return;
        }

        const decimal1 = signedBinaryToDecimal(input1);
        const decimal2 = signedBinaryToDecimal(input2);
        const resultDecimal = decimal1 + decimal2;
        document.getElementById('addition-operation').value = `${decimal1} + ${decimal2} = ${resultDecimal}`;

        const signedBinaryResult = decimalToSignedBinary(resultDecimal);
        binaryResult.value = convertToNibbleFormat(signedBinaryResult);
        octalResult.value = decimalToOctal(resultDecimal);
        decimalResult.value = resultDecimal.toString();
        hexResult.value = decimalToHex(resultDecimal);
    });

    // Division functionality (signed)
    performDivisionButton.addEventListener('click', function () {
        const dividend = convertToNibbleFormatInput(binaryInputDividend.value.trim());
        const divisor = convertToNibbleFormatInput(binaryInputDivisor.value.trim());
        
        document.getElementById('current-dividend').textContent = dividend;
        document.getElementById('current-divisor').textContent = divisor;
        if (!isValidSignedBinaryInput(dividend) || !isValidSignedBinaryInput(divisor)) {
            alert('Invalid signed binary input. The first bit indicates sign (0 for positive, 1 for negative).');
            return;
        }

        const dividendDecimal = signedBinaryToDecimal(dividend);
        const divisorDecimal = signedBinaryToDecimal(divisor);
        if (divisorDecimal === 0) {
            alert('Division by zero is not allowed.');
            return;
        }
        const result = performBinaryDivision(dividend, divisor);

        document.getElementById('division-operation').value =
            `${dividendDecimal} ÷ ${divisorDecimal} = ${result.decimal}`;

        binaryDivisionResult.value = result.binary;
        octalDivisionResult.value = result.octal;
        decimalDivisionResult.value = result.decimal;
        hexDivisionResult.value = result.hex;
    });

    // Multiplication functionality (signed)
    performMultiplicationButton.addEventListener('click', function () {
        const multiplicand = convertToNibbleFormatInput(binaryInputMultiplicand.value.trim());
        const multiplier = convertToNibbleFormatInput(binaryInputMultiplier.value.trim());
    
        if (!isValidSignedBinaryInput(multiplicand) || !isValidSignedBinaryInput(multiplier)) {
            alert('Invalid signed binary input. The first bit indicates sign (0 for positive, 1 for negative).');
            return;
        }
    
        const multiplicandDecimal = signedBinaryToDecimal(multiplicand);
        const multiplierDecimal = signedBinaryToDecimal(multiplier);
        
        const result = performBinaryMultiplication(multiplicand, multiplier);
    
        document.getElementById('multiplication-operation').value = `${multiplicandDecimal} × ${multiplierDecimal} = ${result.decimal}`;
        binaryMultiplicationResult.value = result.binary;
        octalMultiplicationResult.value = result.octal;
        decimalMultiplicationResult.value = result.decimal;
        hexMultiplicationResult.value = result.hex;
    });

    // 2's Complement functionality (signed)
    performComplementButton.addEventListener('click', function () {
        const binaryNumber = convertToNibbleFormatInput(binaryInputComplement.value.trim());

        if (!isValidSignedBinaryInput(binaryNumber)) {
            alert('Invalid signed binary input. The first bit indicates sign (0 for positive, 1 for negative).');
            return;
        }

        const decimalValue = signedBinaryToDecimal(binaryNumber);
        const result = performTwosComplement(binaryNumber);
        document.getElementById('complement-operation').value = `2's complement of ${decimalValue} = ${result.decimal}`;
        binaryComplementResult.value = result.binary;
        octalComplementResult.value = result.octal;
        decimalComplementResult.value = result.decimal;
        hexComplementResult.value = result.hex;
    });

    // Subtraction functionality
    performSubtractionButton.addEventListener('click', function () {
        const minuend = convertToNibbleFormatInput(binaryInputMinuend.value.trim());
        const subtrahend = convertToNibbleFormatInput(binaryInputSubtrahend.value.trim());
    
        if (!isValidSignedBinaryInput(minuend) || !isValidSignedBinaryInput(subtrahend)) {
            alert('Invalid signed binary input. First bit indicates sign (0 for positive, 1 for negative).');
            return;
        }
    
        // Convert signed binary to decimal
        const decimal1 = signedBinaryToDecimal(minuend);
        const decimal2 = signedBinaryToDecimal(subtrahend);
    
        // Perform subtraction in decimal
        const resultDecimal = decimal1 - decimal2;
    
        // Display decimal operation
        document.getElementById('subtraction-operation').value = `${decimal1} - ${decimal2} = ${resultDecimal}`;
    
        // Convert result back to signed 16-bit binary
        const signedBinaryResult = decimalToSignedBinary(resultDecimal, 16, 8);
        binarySubtractionResult.value = convertToNibbleFormat(signedBinaryResult);
    
        // Convert and display in other bases
        octalSubtractionResult.value = decimalToOctal(resultDecimal);  
        decimalSubtractionResult.value = resultDecimal.toString();     
        hexSubtractionResult.value = decimalToHex(resultDecimal);       
    });


    // Existing helper functions
    function isValidBinaryInput(input) {
        return /^[01]+(\.[01]+)?$/.test(input);
    }

    function isValidSignedBinaryInput(input) {
        return /^[01]([01]+)(\.[01]+)?$/.test(input);
    }

    function signedBinaryToDecimal(binary) {
        // Split into integer and fractional parts
        const [intPart, fracPart = ""] = binary.split(".");

        const isNegative = intPart[0] === '1';

        // Combine binary as a whole number string (remove dot for processing)
        const combined = intPart + fracPart;
        const totalBits = combined.length;

        let absBinary = combined;

        if (isNegative) {
            // Convert to positive using two's complement
            absBinary = twosComplement(combined);
        }

        // Convert absolute binary to decimal
        let decimalValue = 0;
        
        for (let i = 0; i < absBinary.length; i++) {
            if (absBinary[i] === '1') {
                decimalValue += Math.pow(2, totalBits - i - 1);
            }
        }

        decimalValue /= Math.pow(2, fracPart.length);

        return isNegative ? -decimalValue : decimalValue;
    }

    function decimalToSignedBinary(decimal, totalBits = 12, fracBits = 4) {
        const isNegative = decimal < 0;
        const absDecimal = Math.abs(decimal);

        const fixedPointValue = Math.round(absDecimal * Math.pow(2, fracBits));
        let binary = fixedPointValue.toString(2).padStart(totalBits, '0');

        if (isNegative) {
            binary = twosComplement(binary);
        }

        // Insert binary point 
        const intPart = binary.slice(0, totalBits - fracBits);
        const fracPart = binary.slice(totalBits - fracBits);

        return intPart + '.' + fracPart;
    }

    function twosComplement(binaryStr) {
        const inverted = binaryStr.split('').map(bit => bit === '0' ? '1' : '0').join('');

        let result = '';
        let carry = 1;

        for (let i = inverted.length - 1; i >= 0; i--) {
            const bit = parseInt(inverted[i]);
            const sum = bit + carry;
            result = (sum % 2) + result;
            carry = Math.floor(sum / 2);
        }

        return result;
    }

    function decimalToOctal(decimal) {
        const intPart = Math.floor(decimal);
        const fracPart = decimal - intPart;

        let octalInt = intPart.toString(8);
        let octalFrac = '';

        // Convert fractional part
        if (fracPart > 0) {
            let tempFrac = fracPart;
            let precision = 6; 
            while (precision-- > 0 && tempFrac > 0) {
                tempFrac *= 8;
                const digit = Math.floor(tempFrac);
                octalFrac += digit.toString(8);
                tempFrac -= digit;
            }
        }

        return octalFrac ? `${octalInt}.${octalFrac}` : octalInt;
    }

    function decimalToHex(decimal) {
        const intPart = Math.floor(decimal);
        const fracPart = decimal - intPart;

        let hexInt = intPart.toString(16).toUpperCase();
        let hexFrac = '';

        // Convert fractional part
        if (fracPart > 0) {
            let tempFrac = fracPart;
            let precision = 6; 
            while (precision-- > 0 && tempFrac > 0) {
                tempFrac *= 16;
                const digit = Math.floor(tempFrac);
                hexFrac += digit.toString(16).toUpperCase();
                tempFrac -= digit;
            }
        }

        return hexFrac ? `${hexInt}.${hexFrac}` : hexInt;
    }

    // Binary Division (signed)
    function performBinaryDivision(dividend, divisor) {
        const dividendDecimal = signedBinaryToDecimal(dividend);
        const divisorDecimal = signedBinaryToDecimal(divisor);

        const resultDecimal = dividendDecimal / divisorDecimal;

        const totalBits = 16;
        const fracBits = 8;

        const resultBinary = decimalToSignedBinary(resultDecimal, totalBits, fracBits);

        return {
            binary: convertToNibbleFormat(resultBinary),
            octal: decimalToOctal(resultDecimal),
            decimal: resultDecimal.toString(),
            hex: decimalToHex(resultDecimal)
        };
    }

    // Binary Multiplication (signed)
    function performBinaryMultiplication(multiplicand, multiplier) {
        const multiplicandDecimal = signedBinaryToDecimal(multiplicand);
        const multiplierDecimal = signedBinaryToDecimal(multiplier);
    
        const resultDecimal = multiplicandDecimal * multiplierDecimal;
    
        const resultBinary = decimalToSignedBinary(resultDecimal, 16, 8);
    
        return {
            binary: convertToNibbleFormat(resultBinary),
            octal: decimalToOctal(resultDecimal),
            decimal: resultDecimal.toString(),
            hex: decimalToHex(resultDecimal)
        };
    }

    // 2's Complement (signed)
    function performTwosComplement(binaryNumber) {
        // Invert the binary number
        const inverted = binaryNumber.split('')
            .map(bit => bit === '0' ? '1' : '0')
            .join('');
    
        let result = '';
        let carry = 1; // Start with the carry to add '1' to the inverted binary
    
        // Add the carry bit to the inverted binary string
        for (let i = inverted.length - 1; i >= 0; i--) {
            const bit = parseInt(inverted[i]);
            const sum = bit + carry;
            result = (sum % 2) + result; // Append result bit
            carry = Math.floor(sum / 2); // Update carry
        }
    
        const negatedBinary = result; // Final negated binary
    
        // Convert the negated binary to decimal, octal, and hex
        const negatedDecimal = signedBinaryToDecimal(negatedBinary);
    
        return {
            binary: convertToNibbleFormat(negatedBinary),
            octal: decimalToOctal(negatedDecimal),
            decimal: negatedDecimal.toString(),
            hex: decimalToHex(negatedDecimal)
        };
    }
    

   
    function convertToNibbleFormatInput(binaryStr) {
        // Remove any existing decimal point
        const [intPart, fracPart] = binaryStr.split('.');

        // Ensure integer part is padded from the left
        const paddedIntPart = intPart.padStart(Math.ceil(intPart.length / 4) * 4, '0');

        // Split integer part into proper 4-bit nibbles
        const intNibbles = [];
        for (let i = 0; i < paddedIntPart.length; i += 4) {
            intNibbles.push(paddedIntPart.slice(i, i + 4));
        }

        // Split fractional part into nibbles
        const fracNibbles = [];
        if (fracPart) {
            for (let i = 0; i < fracPart.length; i += 4) {
                fracNibbles.push(fracPart.slice(i, i + 4).padEnd(4, '0'));
            }
        }

        const formattedInt = intNibbles.join('');
        const formattedFrac = fracNibbles.length > 0 ? '.' + fracNibbles.join('') : '';

        return formattedInt + formattedFrac;
    }

    function convertToNibbleFormat(binaryStr) {
        // Remove any existing decimal point
        const [intPart, fracPart] = binaryStr.split('.');

        // Ensure integer part is padded from the left
        const paddedIntPart = intPart.padStart(Math.ceil(intPart.length / 4) * 4, '0');

        // Split integer part into proper 4-bit nibbles
        const intNibbles = [];
        for (let i = 0; i < paddedIntPart.length; i += 4) {
            intNibbles.push(paddedIntPart.slice(i, i + 4));
        }

        // Split fractional part into nibbles
        const fracNibbles = [];
        if (fracPart) {
            for (let i = 0; i < fracPart.length; i += 4) {
                fracNibbles.push(fracPart.slice(i, i + 4).padEnd(4, '0'));
            }
        }

        // Combine nibbles with space separator
        const formattedInt = intNibbles.join(' ');
        const formattedFrac = fracNibbles.length > 0 ? ' . ' + fracNibbles.join(' ') : '';

        return formattedInt + formattedFrac;
    }

});
