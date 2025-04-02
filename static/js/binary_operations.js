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

    const returnButton = document.querySelector('.return-button');
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

    // Existing addition functionality (signed)
    performAdditionButton.addEventListener('click', function () {
        const input1 = binaryInput1.value.trim();
        const input2 = binaryInput2.value.trim();

        if (!isValidSignedBinaryInput(input1) || !isValidSignedBinaryInput(input2)) {
            alert('Invalid signed binary input. The first bit indicates sign (0 for positive, 1 for negative).');
            return;
        }

        const decimal1 = signedBinaryToDecimal(input1);
        const decimal2 = signedBinaryToDecimal(input2);
        const resultDecimal = decimal1 + decimal2;
        document.getElementById('addition-operation').textContent = `${decimal1} + ${decimal2} = ${resultDecimal}`;

        // Ensure result is always in 2's complement signed binary
        const signedBinaryResult = decimalToSignedBinary(resultDecimal);
        binaryResult.textContent = signedBinaryResult;
        octalResult.textContent = decimalToOctal(Math.abs(resultDecimal));
        decimalResult.textContent = resultDecimal.toString();
        hexResult.textContent = decimalToHex(Math.abs(resultDecimal));
    });

    // Division functionality (signed)
    performDivisionButton.addEventListener('click', function () {
        const dividend = binaryInputDividend.value.trim();
        const divisor = binaryInputDivisor.value.trim();

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
        document.getElementById('division-operation').textContent = `${dividendDecimal} ÷ ${divisorDecimal} = ${result.decimal}`;
        binaryDivisionResult.textContent = result.binary;
        octalDivisionResult.textContent = result.octal;
        decimalDivisionResult.textContent = result.decimal;
        hexDivisionResult.textContent = result.hex;
    });

    // Multiplication functionality (signed)
    performMultiplicationButton.addEventListener('click', function () {
        const multiplicand = binaryInputMultiplicand.value.trim();
        const multiplier = binaryInputMultiplier.value.trim();

        if (!isValidSignedBinaryInput(multiplicand) || !isValidSignedBinaryInput(multiplier)) {
            alert('Invalid signed binary input. The first bit indicates sign (0 for positive, 1 for negative).');
            return;
        }

        const multiplicandDecimal = signedBinaryToDecimal(multiplicand);
        const multiplierDecimal = signedBinaryToDecimal(multiplier);
        const result = performBinaryMultiplication(multiplicand, multiplier);
        document.getElementById('multiplication-operation').textContent = `${multiplicandDecimal} × ${multiplierDecimal} = ${result.decimal}`;
        binaryMultiplicationResult.textContent = result.binary;
        octalMultiplicationResult.textContent = result.octal;
        decimalMultiplicationResult.textContent = result.decimal;
        hexMultiplicationResult.textContent = result.hex;
    });

    // 2's Complement functionality (signed)
    performComplementButton.addEventListener('click', function () {
        const binaryNumber = binaryInputComplement.value.trim();

        if (!isValidSignedBinaryInput(binaryNumber)) {
            alert('Invalid signed binary input. The first bit indicates sign (0 for positive, 1 for negative).');
            return;
        }

        const decimalValue = signedBinaryToDecimal(binaryNumber);
        const result = performTwosComplement(binaryNumber);
        document.getElementById('complement-operation').textContent = `2's complement of ${decimalValue} = ${result.decimal}`;
        binaryComplementResult.textContent = result.binary;
        octalComplementResult.textContent = result.octal;
        decimalComplementResult.textContent = result.decimal;
        hexComplementResult.textContent = result.hex;
    });

    // Subtraction functionality
    performSubtractionButton.addEventListener('click', function () {
        const minuend = binaryInputMinuend.value.trim();
        const subtrahend = binaryInputSubtrahend.value.trim();

        if (!isValidSignedBinaryInput(minuend) || !isValidSignedBinaryInput(subtrahend)) {
            alert('Invalid signed binary input. First bit indicates sign (0 for positive, 1 for negative).');
            return;
        }

        const decimal1 = signedBinaryToDecimal(minuend);
        const decimal2 = signedBinaryToDecimal(subtrahend);
        const resultDecimal = decimal1 - decimal2;
        document.getElementById('subtraction-operation').textContent = `${decimal1} - ${decimal2} = ${resultDecimal}`;

        // Ensure result is always in 2's complement signed binary
        const signedBinaryResult = decimalToSignedBinary(resultDecimal);
        binarySubtractionResult.textContent = signedBinaryResult;
        octalSubtractionResult.textContent = decimalToOctal(Math.abs(resultDecimal));
        decimalSubtractionResult.textContent = resultDecimal.toString();
        hexSubtractionResult.textContent = decimalToHex(Math.abs(resultDecimal));
    });

    // Existing helper functions
    function isValidBinaryInput(input) {
        return /^[01]+(\.[01]+)?$/.test(input);
    }

    function isValidSignedBinaryInput(input) {
        return /^[01]([01]+)(\.[01]+)?$/.test(input);
    }

    function signedBinaryToDecimal(binary) {
        const isNegative = binary[0] === '1';
        const absInput = isNegative ? twosComplement(binary) : binary;
        const decimalValue = binaryToDecimal(absInput);
        return isNegative ? -decimalValue : decimalValue;
    }
    
    function decimalToSignedBinary(decimal, bitLength) {
        const isNegative = decimal < 0;
        let binaryResult = Math.abs(decimal).toString(2);

        binaryResult = binaryResult.padStart(bitLength, '0');

        return isNegative ? twosComplement(binaryResult) : binaryResult;
    }

    function twosComplement(binaryStr) {
        const paddedBinaryStr = binaryStr.padStart(binaryStr.length, '0');

        const invertedBits = paddedBinaryStr.split('').map(bit => bit === '0' ? '1' : '0').join('');

        let result = '';
        let carry = 1;
        for (let i = invertedBits.length - 1; i >= 0; i--) {
            const sum = parseInt(invertedBits[i]) + carry;
            result = (sum % 2) + result;
            carry = Math.floor(sum / 2);
        }

        // Ensure the result has the same length as the input
        while (result.length < paddedBinaryStr.length) {
            result = '0' + result;
        }

        return result;
    }

    // Existing conversion and addition functions (from previous implementation)
    function binaryToDecimal(binary) {
        const [intPart, fracPart] = binary.split('.');
        let decimalValue = 0;

        // Convert integer part
        for (let i = 0; i < intPart.length; i++) {
            decimalValue += parseInt(intPart[intPart.length - 1 - i]) * Math.pow(2, i);
        }

        // Convert fractional part
        if (fracPart) {
            for (let i = 0; i < fracPart.length; i++) {
                decimalValue += parseInt(fracPart[i]) * Math.pow(2, -(i + 1));
            }
        }

        return decimalValue;
    }

    // Existing decimal conversion functions (from previous implementation)
    function decimalToOctal(decimal) {
        const intPart = Math.floor(decimal);
        const fracPart = decimal - intPart;

        let octalInt = intPart.toString(8);
        let octalFrac = '';

        // Convert fractional part
        if (fracPart > 0) {
            let tempFrac = fracPart;
            let precision = 6; // Limit fractional precision
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
            let precision = 6; // Limit fractional precision
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
    
        // Determine the bit length to ensure we handle negative values properly
        const bitLength = Math.max(dividend.length, divisor.length, 8);  // You can set this to 8 or 16 depending on your requirement
    
        let resultBinary = decimalToSignedBinary(Math.abs(resultDecimal), bitLength);
    
        // If the result is negative, convert the binary to two's complement
        if (resultDecimal < 0) {
            resultBinary = twosComplement(resultBinary);
        }
    
        return {
            binary: convertToNibbleFormat(resultBinary),
            octal: decimalToOctal(Math.abs(resultDecimal)),
            decimal: resultDecimal.toString(),
            hex: decimalToHex(Math.abs(resultDecimal))
        };
    }
    // Binary Multiplication (signed)
    function performBinaryMultiplication(multiplicand, multiplier) {
        const multiplicandDecimal = signedBinaryToDecimal(multiplicand);
        const multiplierDecimal = signedBinaryToDecimal(multiplier);

        const resultDecimal = multiplicandDecimal * multiplierDecimal;

        // Convert result to binary
        const resultBinary = decimalToSignedBinary(resultDecimal);

        return {
            binary: convertToNibbleFormat(resultBinary),
            octal: decimalToOctal(Math.abs(resultDecimal)),
            decimal: resultDecimal.toString(),
            hex: decimalToHex(Math.abs(resultDecimal))
        };
    }

    // 2's Complement (signed)
    function performTwosComplement(binaryNumber) {
        const decimalValue = signedBinaryToDecimal(binaryNumber);
        const negatedDecimal = -decimalValue;

        // Handle edge case for minimum representable value
        if (decimalValue === -(2 ** (binaryNumber.length - 1))) {
            return {
                binary: convertToNibbleFormat(binaryNumber), // It remains the same in two’s complement
                octal: decimalToOctal(decimalValue),
                decimal: decimalValue.toString(),
                hex: decimalToHex(decimalValue)
            };
        }

        // Convert negated value to binary
        const negatedBinary = decimalToSignedBinary(negatedDecimal, binaryNumber.length);

        return {
            binary: convertToNibbleFormat(negatedBinary),
            octal: decimalToOctal(negatedDecimal),
            decimal: negatedDecimal.toString(),
            hex: decimalToHex(negatedDecimal)
        };
    }

    // Decimal to Binary conversion
    function decimalToBinary(decimal) {
        const isNegative = decimal < 0;
        const absDecimal = Math.abs(decimal);

        const intPart = Math.floor(absDecimal);
        const fracPart = absDecimal - intPart;

        // Convert integer part
        let binaryInt = intPart.toString(2);
        let binaryFrac = '';

        // Convert fractional part
        if (fracPart > 0) {
            let tempFrac = fracPart;
            let precision = 6; // Limit fractional precision
            while (precision-- > 0 && tempFrac > 0) {
                tempFrac *= 2;
                const digit = Math.floor(tempFrac);
                binaryFrac += digit;
                tempFrac -= digit;
            }
        }

        // Combine parts and handle negative numbers
        const result = binaryFrac ? `${binaryInt}.${binaryFrac}` : binaryInt;
        return isNegative ? `-${result}` : result;
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
