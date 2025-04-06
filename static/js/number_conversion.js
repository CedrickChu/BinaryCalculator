document.addEventListener('DOMContentLoaded', function () {
    // Add loading animation to conversion buttons
    const conversionButtons = document.querySelectorAll('.conversion-button');
    conversionButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const conversion = this.dataset.conversion;
            this.style.opacity = '0.7';
            this.textContent = 'Loading...';

            // Hide all conversion buttons
            const allButtons = document.querySelectorAll('.conversion-button');
            allButtons.forEach(btn => btn.style.display = 'none');

            // Create conversion input container dynamically
            const menuContainer = document.querySelector('.menu-container');
            const existingInputContainer = document.querySelector('.conversion-input-container');
            if (existingInputContainer) {
                existingInputContainer.remove();
            }

            const inputContainer = document.createElement('div');
            inputContainer.className = 'conversion-input-container';
            inputContainer.innerHTML = `
          <div class="input-group">
            <label for="input-number">Enter ${conversion.charAt(0).toUpperCase() + conversion.slice(1)} Number:</label>
            <input type="text" id="input-number" class="number-input" placeholder="Enter number">
          </div>
          <div class="input-group">
            <button id="perform-conversion" class="menu-button">Convert</button>
          </div>
          <div class="result-container">
            <h3>Results:</h3>
            <div class="result-row">
              <label>Binary:</label>
              <span id="binary-result"></span>
            </div>
            <div class="result-row">
              <label>Decimal:</label>
              <span id="decimal-result"></span>
            </div>
            <div class="result-row">
              <label>Hexa:</label>
              <span id="hex-result"></span>
            </div>
            <div class="result-row">
              <label>Octal:</label>
              <span id="octal-result"></span>
            </div>
            
          </div>
        `;

            menuContainer.appendChild(inputContainer);

            // Add conversion event listener
            const performConversionButton = document.getElementById('perform-conversion');
            performConversionButton.addEventListener('click', function () {
                const inputNumber = document.getElementById('input-number').value.trim();

                let decimalValue;
                switch (conversion) {
                    case 'binary':
                        if (!isValidBinaryInput(inputNumber)) {
                            alert('Invalid binary input. Only 0s and 1s allowed.');
                            return;
                        }
                        nibbleInputNumber = convertToNibbleFormatInput(inputNumber)
                        decimalValue = binaryToDecimal16Bit(nibbleInputNumber);
                        break;
                    case 'decimal':
                        decimalValue = parseFloat(inputNumber);
                        break;
                    case 'octal':
                        if (!isValidOctalInput(inputNumber)) {
                            alert('Invalid octal input. Only digits 0-7 allowed.');
                            return;
                        }
                        decimalValue = parseInt(inputNumber, 8);
                        break;
                    case 'hexa':
                        if (!isValidHexInput(inputNumber)) {
                            alert('Invalid hexadecimal input. Only digits 0-9 and A-F allowed.');
                            return;
                        }
                        decimalValue = parseInt(inputNumber, 16);
                        break;
                }

                // Display results
                document.getElementById('binary-result').textContent = convertToNibbleFormat(decimalToBinary16Bit(decimalValue));
                document.getElementById('decimal-result').textContent = decimalValue;
                document.getElementById('hex-result').textContent = decimalToHex16Bit(Math.abs(decimalValue));
                document.getElementById('octal-result').textContent = decimalToOctal16Bit(Math.abs(decimalValue));
            });
        });
    });

    // Conversion helper functions
    function convertFromBinary(input, targetSystem) {
        const isNegative = input.startsWith('-');
        const absInput = isNegative ? input.slice(1) : input;

        const decimalValue = binaryToDecimal16Bit(absInput);
        const convertedValue = convertDecimalToSystem(decimalValue, targetSystem);

        return isNegative ? `-${convertedValue}` : convertedValue;
    }

    function convertFromDecimal(input, targetSystem) {
        const decimalValue = parseFloat(input);
        return convertDecimalToSystem(decimalValue, targetSystem);
    }

    function convertFromOctal(input, targetSystem) {
        const isNegative = input.startsWith('-');
        const absInput = isNegative ? input.slice(1) : input;

        const decimalValue = parseInt(absInput, 8);
        const convertedValue = convertDecimalToSystem(decimalValue, targetSystem);

        return isNegative ? `-${convertedValue}` : convertedValue;
    }

    function convertFromHex(input, targetSystem) {
        const isNegative = input.startsWith('-');
        const absInput = isNegative ? input.slice(1) : input;

        const decimalValue = parseInt(absInput, 16);
        const convertedValue = convertDecimalToSystem(decimalValue, targetSystem);

        return isNegative ? `-${convertedValue}` : convertedValue;
    }

    function convertDecimalToSystem(decimal, targetSystem) {
        const isNegative = decimal < 0;
        const absDecimal = Math.abs(decimal);

        let result;
        switch (targetSystem) {
            case 'binary':
                result = decimalToBinary16Bit(absDecimal);
                break;
            case 'decimal':
                result = decimal.toString();
                break;
            case 'octal':
                result = decimalToOctal16Bit(absDecimal);
                break;
            case 'hex':
                result = decimalToHex16Bit(absDecimal);
                break;
        }

        return isNegative ? `-${result}` : result;
    }

    function binaryToDecimal16Bit(binary) {
        const [intPart, fracPart] = binary.split('.');
        let decimalValue = 0;

        // Convert integer part (signed)
        const signBit = intPart[0];
        const absIntPart = signBit === '1' ? twosComplement(intPart) : intPart;
        for (let i = 0; i < absIntPart.length; i++) {
            decimalValue += parseInt(absIntPart[absIntPart.length - 1 - i]) * Math.pow(2, i);
        }
        if (signBit === '1') decimalValue = -decimalValue;

        // Convert fractional part
        if (fracPart) {
            for (let i = 0; i < fracPart.length; i++) {
                decimalValue += parseInt(fracPart[i]) * Math.pow(2, -(i + 1));
            }
        }

        return decimalValue;
    }

    function decimalToOctal16Bit(decimal) {
        const intPart = Math.floor(decimal);
        const fracPart = decimal - intPart;

        let octalInt = intPart.toString(8).padStart(3, '0');
        let octalFrac = '';

        // Convert fractional part
        if (fracPart > 0) {
            let tempFrac = fracPart;
            let precision = 3; // Limit to 3 fractional digits for 8-bit representation
            while (precision-- > 0 && tempFrac > 0) {
                tempFrac *= 8;
                const digit = Math.floor(tempFrac);
                octalFrac += digit.toString(8);
                tempFrac -= digit;
            }
        }

        return octalFrac ? `${octalInt}.${octalFrac}` : octalInt;
    }

    function decimalToHex16Bit(decimal) {
        const intPart = Math.floor(decimal);
        const fracPart = decimal - intPart;

        let hexInt = intPart.toString(16).toUpperCase().padStart(2, '0');
        let hexFrac = '';

        // Convert fractional part
        if (fracPart > 0) {
            let tempFrac = fracPart;
            let precision = 2; // Limit to 2 fractional digits for 8-bit representation
            while (precision-- > 0 && tempFrac > 0) {
                tempFrac *= 16;
                const digit = Math.floor(tempFrac);
                hexFrac += digit.toString(16).toUpperCase();
                tempFrac -= digit;
            }
        }

        return hexFrac ? `${hexInt}.${hexFrac}` : hexInt;
    }

    function decimalToBinary16Bit(decimal) {
        const isNegative = decimal < 0;
        const absDecimal = Math.abs(decimal);

        // Convert integer part to binary
        let intPart = Math.floor(absDecimal);
        let fracPart = absDecimal - intPart;

        let binaryInt = intPart.toString(2);

        // Determine minimum bit length (8-bit or 16-bit)
        let bitLength = binaryInt.length > 7 ? 16 : 8;
        binaryInt = binaryInt.padStart(bitLength - 1, '0'); // Reserve 1 bit for sign

        // Convert fractional part
        let binaryFrac = '';
        let tempFrac = fracPart;
        let precision = 8; // 8-bit precision for fractional part

        while (precision-- > 0 && tempFrac > 0) {
            tempFrac *= 2;
            let bit = Math.floor(tempFrac);
            binaryFrac += bit;
            tempFrac -= bit;
        }

        // Ensure 8-bit fractional part
        binaryFrac = binaryFrac.padEnd(8, '0');

        let binaryResult = `${binaryInt}.${binaryFrac}`;

        // Handle negative numbers using two’s complement
        if (isNegative) {
            let twosComp = twosComplement(binaryInt);
            binaryResult = `${twosComp}.${binaryFrac}`;
        }

        return binaryResult;
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


    // Input validation function
    function isValidBinaryInput(input) {
        return /^[01]+(\.[01]+)?$/.test(input);
    }

    function isValidHexInput(input) {
        return /^[0-9A-Fa-f]+(\.[0-9A-Fa-f]+)?$/.test(input);
    }

    function isValidOctalInput(input) {
        return /^[0-7]+(\.[0-7]+)?$/.test(input);
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
    // 2's Complement functionality (signed)
    performComplementButton.addEventListener('click', function () {
        const binaryNumber = binaryInputComplement.value.trim();

        if (!isValidSignedBinaryInput(binaryNumber)) {
            alert('Invalid signed binary input. The first bit indicates sign (0 for positive, 1 for negative).');
            return;
        }

        const decimalValue = signedBinaryToDecimal(binaryNumber);
        const result = twosComplement(binaryNumber);

        // Display results
        document.getElementById('complement-operation').textContent = `2's complement of ${decimalValue} = ${result.decimal}`;
        binaryComplementResult.textContent = result.binary;
        octalComplementResult.textContent = result.octal;
        decimalComplementResult.textContent = result.decimal;
        hexComplementResult.textContent = result.hex;
    });



    // Add event listeners to validate input
    document.addEventListener('DOMContentLoaded', function () {
        const inputField = document.getElementById('input-number');
        const targetSystemSelect = document.getElementById('target-system');

        targetSystemSelect.addEventListener('change', function () {
            const selectedSystem = this.value;
            const inputValue = inputField.value.trim();

            let isValid = true;
            switch (selectedSystem) {
                case 'binary':
                    isValid = isValidBinaryInput(inputValue);
                    break;
                case 'hex':
                    isValid = isValidHexInput(inputValue);
                    break;
                case 'octal':
                    isValid = isValidOctalInput(inputValue);
                    break;
            }

            if (!isValid) {
                alert(`Invalid input for ${selectedSystem.toUpperCase()} number system`);
                inputField.value = '';
            }
        });
    });
});
